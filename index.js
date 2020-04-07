const fs           = require('fs');
const crypto       = require('crypto');
const FormData     = require('form-data');
const axios        = require('axios');

// read the answer.json file
var jsonData  = fs.readFileSync("./ressources/answer.json", "utf8");
var arrData   = JSON.parse(jsonData);
var decrypted = '';
// characters to ignore in crypt
var ignore    = [' ','.',','];

arrData.cifrado.split("").map( item => {
    char      = returnChar(item.toUpperCase().charCodeAt(0), arrData.numero_casas);
    increment = String.fromCharCode(char);

    decrypted += (ignore.indexOf(item) !== -1) ? item : increment;
});

var cryptSHA1 = hashSHA1(decrypted.toLowerCase());

arrData.decifrado = decrypted.toLowerCase();
arrData.resumo_criptografico = cryptSHA1;

function returnChar(posItem, interval) {
    if (posItem < 65 || posItem > 90) return '';

    if ((posItem - interval) < 65) {
        return 90 - (interval - (posItem - 65)) + 1;
    } else {
        return posItem - interval;
    }
}

function hashSHA1(string) {
    var hash = crypto.createHash('sha1');
    return hash.update(string).digest('hex');
    // return data.digest('hex');
}

fs.writeFile('./ressources/answer.json', JSON.stringify(arrData), err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})

const formData = new FormData();
formData.append('answer', fs.createReadStream('./ressources/answer.json'));
axios.post('https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=9dbe18d7a04f036dd90b01a31e02fe02515e3127', formData, {
  // You need to use `getHeaders()` in Node.js because Axios doesn't
  // automatically set the multipart form boundary in Node.
  headers: formData.getHeaders()
}).then(function(response) {
    console.log(response.data);
});
