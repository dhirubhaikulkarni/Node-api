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

  app.get(
    "/api/BooksDetails/Search/:inputdata",
    (req, res) => {
      let searchdata = req.params.inputdata;
      console.log(searchdata);
      bookdetails
        .find({ bookname: { $regex: searchdata, $options: "i" } })
        .populate("Category")
        .populate("Publisher")
        .exec((err, results) => {
          return res.send(results);
        });
    },
    []
  );

//Search Category API
app.get("/api/BooksDetails/Search1/:inputDataCategory", (req, res) => {
  categorydetails
    .find({ Name: { $regex: req.params.inputDataCategory } })
    .exec((err, result, ) => {
   
       const data = result.map((bk) => {
         bookdetails.find({Category: bk._id})
         .populate("Category")
         .populate("Publisher")
         .exec((err, result1)=>{
           console.log(result1);
           return res.send(result1);
         })
      }); 
    });
});

//Search Publisher API
app.get("/api/BooksDetails/Search2/:inputDataPublisher", (req, res) => {
  publisherdetails
    .find({ Name: { $regex: req.params.inputDataPublisher } })
    .exec((err, result, ) => {
   
       const data = result.map((bk) => {
         bookdetails.find({Publisher: bk._id})
         .populate("Category")
         .populate("Publisher")
         .exec((err, result1)=>{
           console.log(result1);
           return res.send(result1);
         })
      }); 
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
    console.log(req.params.categoryId);
    categorydetails
      .findOne({ categoryid: req.params.categoryId })
      .exec((err, results) => {
        console.log(results);
        return res.send(results);
      });
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

  app.get("/api/PublisherDetails", (req, res) => {
    publisherdetails.find().exec((err, publisherdetails) => {
      return res.send(publisherdetails);
    });
  });

  app.get("/api/PublisherDetails/:publisherId", (req, res) => {
    console.log(req.params.publisherId);
    publisherdetails
      .findOne({ publisherid: req.params.publisherId })
      .exec((err, results) => {
        console.log(results);
        return res.send(results);
      });
  });

  app.post("/api/PublisherDetails/edit", (req, res) => {
    publisherdetails.findOne({ publisherid: req.body.id }, (err, found1) => {
      if (found1) {
        found1.Name = req.body.data.Name;
        return found1.save((err) => {
          return res.send({ status: "Publisher Edit Successfully" });
        });
      }
    });
  });

  app.post("/api/PublisherDetails/add", (req, res) => {
    publisherdetails.findOne(
      { publisherid: req.body.data.publisherId },
      (err, found1) => {
        if (!found1) {
          const newData = new publisherdetails();
          newData.publisherid = req.body.data.publisherid;
          newData.Name = req.body.data.Name;

          return newData.save((err) => {
            return res.send({ status: "Publisher Add Successfully" });
          });
        }
      }
    );
  });

  return app;
};
