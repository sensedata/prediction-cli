# Introduction

This is a CLI for the Google Prediction API.


# Mac Prerequisites for Development

## XCode
Install Xcode <http://developer.apple.com/xcode/>

## Node
The prediction-cli utility is powered by node.

    $ brew install node
    
## GSUtil
A tool that enables you to access Google Cloud Storage from the command-line.

    $ pip install gsutil
    
Or, follow instructions at https://developers.google.com/storage/docs/gsutil_install

# Google Developer Console Configuration

1. Create a new project in Google Developer Console

2. Activate Cloud Storage and Prediction API's

3. Create a new service account credential

4. Download Credential Private Key


# Local Configuration

1.  Authorize GSUtil to access your project's cloud storage.

        $ gsutil config

2. Translate Private Key for Node

> Note on the private_key.pem:
> Node.js currently does not support direct access to the keys stored within PKCS12 file
> (see issue comment https://github.com/joyent/node/issues/4050#issuecomment-8816304)
> so the private key must be extracted and converted to a passphrase-less RSA key:

        $ openssl pkcs12 -in private_key.p12 -nocerts -nodes | openssl rsa -out private_key.pem

3. Clone this repository.

4. Install the project, plus dependencies, globally

        $ cd /the/repo/dir
        $ npm install -g

# Usage

1. Upload csv formatted, seed training data

        $ gsutil cp training_data.csv gs://bucket_name/training_data.csv
        
2. Utilize the command line app to process, update and query the data via the Google Prediction API
        
        $ prediction-cli -h

