const bookdetails = require("../Models/bookdetails");
const publisherdetails = require("../Models/publisherdetailslkp");
const categorydetails = require("../Models/categorydetailslkp");

module.exports = (app) => {
  app.get("/api/BooksDetails", (req, res) => {
    bookdetails
      .find({ IsActive: "true" })
      .populate("Category")
      .populate("Publisher")
      .exec((err, bookdetails) => {
        return res.send(bookdetails);
      });
  });

  app.get("/api/BooksDetails/:bookId", (req, res) => {
    bookdetails
      .findOne({ BDID: req.params.bookId })

      .populate("Category")

      .populate("Publisher")

      .exec((err, result) => {
        return res.send(result);
      });
  });

  app.post("/api/BooksDetails/edit", (req, res) => {
    categorydetails.findOne(
      { Name: req.body.data.Category.Name },
      (err, found1) => {
        publisherdetails.findOne(
          { Name: req.body.data.Publisher.Name },
          (err, found2) => {
            bookdetails.findOne({ BDID: req.body.id }, (err, found3) => {
              if (found3) {
                found3.bookname = req.body.data.bookname;
                found3.Category = found1._id;
                found3.Publisher = found2._id;
                found3.quantity = req.body.data.quantity;
                return found3.save((err) => {
                  return res.send({ editstatus: "Book Edited Successfully" });
                });
              }
            });
          }
        );
      }
    );
  });
  
  app.post("/api/CategoryDetails/edit", (req, res) => {
    categorydetails.findOne({ categoryid: req.body.id }, (err, found1) => {
      if (found1) {
        found1.Name = req.body.data.Name;
        return found1.save((err) => {
          return res.send({ status: "Category Edit Successfully" });
        });
      }
    });
  });

  app.post("/api/BooksDetails/add", (req, res) => {
    categorydetails.findOne(
      { Name: req.body.data.Category.Name },
      (err, found1) => {
        publisherdetails.findOne(
          { Name: req.body.data.Publisher.Name },
          (err, found2) => {
            bookdetails.findOne({ BDID: req.body.data.BDID }, (err, found3) => {
              if (!found3) {
                const newData = new bookdetails();
                newData.BDID = req.body.data.BDID;
                newData.bookname = req.body.data.bookname;
                newData.Category = found1._id;
                newData.Publisher = found2._id;
                newData.quantity = req.body.data.quantity;
                return newData.save((err) => {
                  return res.send({ status: "Book Added Successfully" });
                });
              }
            });
          }
        );
      }
    );
  });

  app.get("/api/BooksDetails/delete/:BookId", (req, res) => {
    bookdetails.findOne(
      { BDID: req.params.BookId },
      (err, foundBookdetails) => {
        if (foundBookdetails) {
          foundBookdetails.IsActive = !foundBookdetails.IsActive;

          foundBookdetails.save((err) => {
            res.send({
              status: "OK",
              message: "Deleted succesfully",
              bookd: foundBookdetails,
            });
          });
        }
      }
    );
  });

  app.get("/api/CategoryDetails", (req, res) => {
    categorydetails.find().exec((err, categorydetails) => {
      return res.send(categorydetails);
    });
  });

  app.get("/api/CategoryDetails/:categoryId", (req, res) => {
    categorydetails
      .findone({ categoryid: req.params.categoryid })
      .exec((err, categorydetails) => {
        return res.send(categorydetails);
      });
  });


  app.post("/api/CategoryDetails/add", (req, res) => {
    categorydetails.findOne(
      { categoryid: req.body.data.categoryid },
      (err, found1) => {
        if (!found1) {
          const newData = new categorydetails();
          newData.categoryid = req.body.data.categoryid;
          newData.Name = req.body.data.Name;

          return newData.save((err) => {
            return res.send({ status: "Category Add Successfully" });
          });
        }
      }
    );
  });

  app.get("/api/publisherdetails", (req, res) => {
    publisherdetails.find().exec((err, publisherdetails) => {
      return res.send(publisherdetails);
    });
  });

  return app;
};
