var express = require("express");
var router = express.Router();
var ProductModel = require("./products");

router.post("/", (req, res) => {
    let productDocument = new ProductModel({
        name: req.body.name
    })
    productDocument.save((err, productDocumentReturned) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(productDocumentReturned);
    })
})

router.get("/", (req, res) => {
    ProductModel.find().exec((err, produtos) => {
        if (err)
            res.status(500).send(err)
        else
            res.status(200).send(produtos);
    })
})

router.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id;

        await ProductModel.deleteOne({ _id: id })
        res.status(200).send({});
    }
    catch (err) {
        res.status(500).send({ msg: "Internal error :", error: err })
    }
})

router.patch("/:id", (req, res) => {
    ProductModel.findById(req.params.id, (err, product) => {
        if (err)
            res.status(500).send(err);
        else if (!product)
            res.status(404).send({ });
        else {
            product.name = req.body.name;
            product.save()
                // executado após resolução da Promise => promise resolvida então...
                .then((p) => res.status(200).send(p)) //faz o papel do try catch - try
                .catch((e) => res.status(500).send(e))
        }
    })
})

module.exports = router;
