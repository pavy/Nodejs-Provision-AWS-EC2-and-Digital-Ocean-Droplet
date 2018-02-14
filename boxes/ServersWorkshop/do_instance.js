var needle = require("needle");
var os   = require("os");
const fs = require('fs');

var config = {};
config.token = process.env.DOTOKEN;
//console.log("Your token is:", config.token);

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

// Documentation for needle:
// https://github.com/tomas/needle

var client =
{
    createSSHKey: function(sshKeyName, publicKey , onResponse){
        var data = 
        {
            "name": sshKeyName,
            "public_key": publicKey,
        };

        needle.post("https://api.digitalocean.com/v2/account/keys", data, {headers:headers,json:true}, onResponse );
    },

	createDroplet: function (dropletName, region, imageName, sshId, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[sshId],
			//"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		//console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );

	},

	getDropletInfo: function( dropletId, onResponse)
	{
		var url = `https://api.digitalocean.com/v2/droplets/${dropletId}`
		needle.get(url, {headers:headers}, onResponse)
	}
};

//Reading the public rsa key into a varible
var publicKey;
var pubKeyFilePath = '/home/vagrant/.ssh/id_rsa.pub';
fs.readFile(pubKeyFilePath, {encoding: 'utf-8'},function(err, data){
    if(err)
        console.log(err);
    else{
        publicKey = data;
        var keyName = "MySSHKey";
        var sshKeyId;
        //console.log(data);
        client.createSSHKey(keyName, publicKey, function(err, resp, body)
        {
            if(!err && resp.statusCode == 201)
            {
                console.log("\n -------- Public RSA Key has been added to your digital ocean account -----");
                //console.log("KEYID: ",body.ssh_key.id);
                console.log("\n KEY NAME: ",body.ssh_key.name);

                sshKeyId = body.ssh_key.id;

                // #############################################
				// Create an droplet with the specified name, region, and image

                var name = "MyDroplet";
                var region = "nyc1"; // Fill one in from #1
                var image = "ubuntu-14-04-x64";//"21669205"; // Fill one in from #2
                client.createDroplet(name, region, image, sshKeyId, function(err, resp, body)
                {
                	if(!err && resp.statusCode == 202)
                	{
                		//console.log( JSON.stringify( body, null, 3 ) );
                		console.log("\n -------- Droplet Created! -----");
                		//console.log(body);
                		console.log("\n Droplet Id: ",body.droplet.id);
                		
                        
                        // #############################################
                        // #4 Extend the client to retrieve information about a specified droplet.
                        var dropletId = body.droplet.id;
                        var myIPAddress;
                        //setTimeout(function() {console.log("\nWaiting...\n")}, 5000);
                        client.getDropletInfo( dropletId, function(error, response){
                        	var data = response.body;
                        	//console.log( JSON.stringify(response.body) );
                        	console.log ( "IP Address is: ",data.droplet.networks.v4[0].ip_address);
                        	myIPAddress = data.droplet.networks.v4[0].ip_address;
                        	
                        	let filePath='/home/vagrant/scripts/inventory';
                            var buffer = myIPAddress +' ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa\n';
                            
     
                            // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
                            fs.appendFile(filePath, buffer, function(err) {
                                if (err) throw 'error writing file: ' + err;
                            });
                        });

                	}
                	else{
                		console.log("Error in creating droplet:", err);
                	}
                });
            }else{
                console.log("Error in creating ssh key:", err);
            }
        });
    }
});


/* 
*/

// Comment out when done.
// https://developers.digitalocean.com/documentation/v2/#retrieve-an-existing-droplet-by-id
// REMEMBER POST != GET
// Most importantly, print out IP address!


// #############################################
// #5 In the command line, ping your server, make sure it is alive!
// ping xx.xx.xx.xx

