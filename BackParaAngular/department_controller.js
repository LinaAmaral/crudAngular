var express = require("express");
var router = express.Router();
var DepartmentModel = require("./department"); //pega o modelo, que vem lá do departments

router.post("/", (req, res) => {
    let departmentDocument = new DepartmentModel({
        name: req.body.name
    })
    departmentDocument.save((err, d) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(d);
    })
})

router.get("/", (req, res) => {
    DepartmentModel.find().exec((err, departments) => {
        if (err)
            res.status(500).send(err)
        else
            res.status(200).send(departments);
    })
})

router.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id;

        await DepartmentModel.deleteOne({ _id: id })
        res.status(200).send({});
    }
    catch (err) {
        res.status(500).send({ msg: "Internal error :", error: err })
    }
})

router.patch("/:id", (req, res) => {
    DepartmentModel.findById(req.params.id, (err, department) => {
        if (err)
            res.status(500).send(err);
        else if (!department)
            res.status(404).send({ department });
        else {
            department.name = req.body.name;
            department.save()
                .then((d) => res.status(200).send(d)) //faz o papel do try catch - try
                .catch((e) => res.status(500).send(e))
        }
    })
})

module.exports = router;
