var express = require('express');
var router = express.Router();
const Categories = require('../db/models/Categories');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require("../config/Enum");
const AuditLogs = require('../lib/AuditLogs');
const logger = require('../lib/logger/LoggerClass');
const auth = require('../lib/auth')();
const config = require('../config');
const i18n = new (require('../lib/i18n'))(config.DEFAULT_LANG);
const multer = require('multer');
const path = require('path');
const excelExport = new (require('../lib/Export'))();
const fs = require('fs');
const Import = new (require('../lib/Import'))();

let multerStorage = multer.diskStorage({
  destination: (req,file,next) => {
    next(null, config.FILE_UPLOAD_PATH);
  },
  fileName: (req,file,next) =>{
    next(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage: multerStorage}).single("pb_file")

/*
  CRUD Operations for Categories
  - Create: POST /categories
  - Read: GET /categories
  - Update: PUT /categories/:id
  - Delete: DELETE /categories/:id
*/

router.all("*", auth.authenticate(), (req, res, next) => {
    next();
});


/* GET categories listing. */
router.get('/',auth.checkRoles("category_view"), async (req, res, next) => {
  try{
      let categories = await Categories.find({});

      res.json(Response.successResponse(categories));
  }catch(err){
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(Response.errorResponse(err));
  }
});

router.post('/add',auth.checkRoles("category_add"), async(req, res)=> {
    let body = req.body;
    try{
      if(!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language), i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["name"]));

      let category = new Categories({
        name: body.name,
        is_active: true,
        created_by: req.user?.id
      });

      await category.save();

      AuditLogs.info(req.user?.email, "Categories", "Add", category);
      logger.info(req.user?.email, "Categories", "Add", category);

      res.json(Response.successResponse({success:true}));
    
    } catch(err){
      logger.error(req.user?.email, "Categories", "Add", err);
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
    }
  });

  router.post('/update',auth.checkRoles("category_update"), async(req, res) => {
    let body = req.body;

    try{
      if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language), i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["_id"]));
      let updates = {};

      if(body.name) updates.name = body.name;
      if(typeof body.is_active === "boolean") updates.is_active = body.is_active;

      await Categories.updateOne({_id: body._id}, updates);

      AuditLogs.info(req.user?.email, "Categories", "Update", {_id: body._id, ...updates});


      res.json(Response.successResponse({success: true}));

    }catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
  });

  router.post('/delete',auth.checkRoles("category_delete"), async(req, res) => {
    let body = req.body;

    try{
      if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user?.language), i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user?.language, ["_id"]));
    
      await Categories.deleteOne({_id: body._id});

      AuditLogs.info(req.user?.email, "Categories", "Delete", {_id: body._id});

      res.json(Response.successResponse({success: true}));

    }catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
  });

  router.post("/export", auth.checkRoles("category_add"), async (req, res) => {
    try {
        let categories = await Categories.find({});


        let excel = excelExport.toExcel(
            ["NAME", "IS ACTIVE?", "USER_ID", "CREATED AT", "UPDATED AT"],
            ["name", "is_active", "created_by", "created_at", "updated_at"],
            categories
        )

        let filePath = __dirname + "/../tmp/categories_excel_" + Date.now() + ".xlsx";

        fs.writeFileSync(filePath, excel, "UTF-8");

        res.download(filePath);

        // fs.unlinkSync(filePath);

    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(Response.errorResponse(err));
    }
});

  router.post("/import", auth.checkRoles("category_add"),upload, async(req, res) => {
    try {
      let file = req.file;
      let body = req.body;

      let rows = Import.fromExcel(file.path);

      for(let i=1; i<rows.length; i++){
        let [name, is_active, user, created_at, updated_at] = rows[i];
        if(name){
          await Categories.create({
          name,
          is_active,
          created_by: req.user._id
        });
        }
      }

      res.json(Response.successResponse(req.body, Enum.HTTP_CODES.CREATED));
      
    } catch (err) {
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
    }
  })

module.exports = router;
