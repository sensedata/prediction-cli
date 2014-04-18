var concat = require('concat-stream');
var csv = require('csv');
var path = require('path');
var googleapis = require('googleapis');

var newAuthClient = function(email, keyfile, scopes) {
  return new googleapis.auth.JWT(
      email,
      keyfile,
      null,
      scopes,
      null);

};

var processCsvFile = function (csvFile, cb) {
  csv()
  .from.path(path.normalize(csvFile), { trim: true })
  .to.array(function (data) {
    cb(data);
  }).on('record', function(row,index){
    console.log('#'+index+' '+JSON.stringify(row));
  }).on('error', function(error){
    console.log(error.message);
  });
};



exports.analyze = function(email, keyfile, projectId, modelId, cb) {
  var authClient = newAuthClient(email, keyfile, ['https://www.googleapis.com/auth/prediction']);
 
  authClient.authorize(function(err, tokens) {
    if (err) {
      cb(err);
      return;
    }
      
    googleapis
      .discover('prediction', 'v1.6')
      .execute(function(err, client) {
        client.prediction.trainedmodels.analyze({project: projectId, id: modelId}).withAuthClient(authClient).execute(function(err, result) {
          cb(err, result);
        });      
      });
  });
  
};

exports.delete = function(email, keyfile, projectId, modelId, cb) {
  var authClient = newAuthClient(email, keyfile, ['https://www.googleapis.com/auth/prediction']);
 
  authClient.authorize(function(err, tokens) {
    if (err) {
      cb(err);
      return;
    }
      
    googleapis
      .discover('prediction', 'v1.6')
      .execute(function(err, client) {
        client.prediction.trainedmodels.delete({project: projectId, id: modelId}).withAuthClient(authClient).execute(function(err, result) {
          cb(err, result);
        });      
      });
  });
  
};

exports.get = function(email, keyfile, projectId, modelId, cb) {
  var authClient = newAuthClient(email, keyfile, ['https://www.googleapis.com/auth/prediction']);
 
  authClient.authorize(function(err, tokens) {
    if (err) {
      cb(err);
      return;
    }
      
    googleapis
      .discover('prediction', 'v1.6')
      .execute(function(err, client) {
        client.prediction.trainedmodels.get({project: projectId, id: modelId}).withAuthClient(authClient).execute(function(err, result) {
          cb(err, result);
        });      
      });
  });
  
};

exports.insert = function(email, keyfile, projectId, modelId, csvFile, cb) {
  var authClient = newAuthClient(email, keyfile, [
      'https://www.googleapis.com/auth/devstorage.full_control',
      'https://www.googleapis.com/auth/devstorage.read_only',
      'https://www.googleapis.com/auth/devstorage.read_write',
      'https://www.googleapis.com/auth/prediction'
      ]);
 

  authClient.authorize(function(err, tokens) {
    if (err) {
      cb(err);
      return;
    }
    
    // processCsvFile(csvFile, function (data) {
    // 
    //   var trainingData = [];
    //   for(var i = 0, l = data.length; i<l; i++) {
    //     trainingData.push({
    //       output: data[i][0],
    //       cvsInstance: data[i].slice(1)
    //     });
    //   }
    // 
    //   googleapis
    //     .discover('prediction', 'v1.6')
    //     .execute(function(err, client) {
    //       client.prediction.trainedmodels.insert({
    //         project: projectId
    //       }, {
    //         id: modelId,
    //         trainingInstances: trainingData
    //       }).withAuthClient(authClient).execute(function(err, result) {
    //         cb(err, result);
    //       });      
    //     });
    //     
    // });
    
    googleapis
      .discover('prediction', 'v1.6')
      .execute(function(err, client) {
        client.prediction.trainedmodels.insert(
          { project: projectId },
          { id: modelId, 
            storageDataLocation: csvFile
          }
        ).withAuthClient(authClient).execute(function(err, result) {
          cb(err, result);
        });      
      });
    
  });
  
};

exports.list = function(email, keyfile, projectId, cb) {
  var authClient = newAuthClient(email, keyfile, ['https://www.googleapis.com/auth/prediction']);
 
  authClient.authorize(function(err, tokens) {
    if (err) {
      cb(err);
      return;
    }
      
    googleapis
      .discover('prediction', 'v1.6')
      .execute(function(err, client) {
        client.prediction.trainedmodels.list({project: projectId}).withAuthClient(authClient).execute(function(err, result) {
          cb(err, result);
        });      
      });
  });
  
};

exports.predict = function(email, keyfile, projectId, modelId, value, cb) {
  var authClient = newAuthClient(email, keyfile, ['https://www.googleapis.com/auth/prediction']);
 
  authClient.authorize(function(err, tokens) {
    if (err) {
      cb(err);
      return;
    }
      
    googleapis
      .discover('prediction', 'v1.6')
      .execute(function(err, client) {
        client.prediction.trainedmodels.predict(
          { project: projectId, id: modelId },
          { input: { csvInstance: [value] } }
        ).withAuthClient(authClient).execute(function(err, result) {
          cb(err, result);
        });      
      });
  });
  
};

exports.update = function(email, keyfile, projectId, modelId, csvFile, cb) {
  var authClient = newAuthClient(email, keyfile, ['https://www.googleapis.com/auth/prediction']);
 
  authClient.authorize(function(err, tokens) {
    if (err) {
      cb(err);
      return;
    }
    
    processCsvFile(csvFile, function (data) {
      
      data.forEach(function (line) {
        
        googleapis
          .discover('prediction', 'v1.6')
          .execute(function(err, client) {
            client.prediction.trainedmodels.update(
              { project: projectId,
                id: modelId
              },
              { output: line[0],
                csvInstance: line.slice(1)
              }
            ).withAuthClient(authClient).execute(function(err, result) {
              cb(err, result);
            });      
          });
        
      });

    });
    
  });

};

