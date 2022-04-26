const CONTRACT_ADDRESS = "0x4c2667CA6AeD5033B38A9Fd8CfEACCF916E2ebFa"
let contractABI, objContract;


initialize()


async function initialize() {
  if (!await loadWeb3()) {
    alert("Please install metamask or ethereum compatible browser")
    return
  }

  contractABI = await $.getJSON('contract/contract_ABI.json')
  objContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS)

  await getAccounts()
}

async function loadWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum)
    window.ethereum.enable()
    return true
  }

  return false
}

async function getAccounts() {
  const accounts = await web3.eth.getAccounts()
  console.log(accounts);

  $('#lblAddress').text(accounts[0])

  await getAccountBalance(accounts[0])
  await getUser(accounts[0])
}

async function getAccountBalance(_account) {
  let blnc = await web3.eth.getBalance(_account)
  blnc = web3.utils.fromWei(blnc)
  console.log(blnc);
}

async function getUser(_address) {
  objContract.methods.mapUsers(_address).call( function (err, result) {
    if(err) {
      alert(err)
      return
    }

    console.log(result)

    if(result.isActive){
      $('#divRegistration').hide()
      $('#divUserInfo').show()

      $('#lblUsername').text(result.name)
      $('#txtName').val(result.name)
      $('#txtEmail').val(result.email)
      $('#txtCountry').val(result.country)
      $('#txtGender').val(result.gender)
    }
  })
}

async function addUser() {
  let _address = $('#lblAddress').text()
  let _name = $('#txtName').val()
  let _email = $('#txtEmail').val()
  let _country = $('#txtCountry').val()
  let _gender = $('#txtGender').val()
  
  
  objContract.methods.registerUser(_name, _country, _email, _gender).send({ from: _address })
  .on('transactionHash', function(hash) {
    $('#loader').show()
    console.log(hash);
  })
  .on('confirmation', function(confirmationNumber, receipt) {
    if(confirmationNumber === 0) {
      $('#loader').hide()
      alert("Transaction successfull")
    }
  })
  .on('error', function(error, receipt) {
    $('#loader').hide()
    console.log('error');
    console.log(error);
    alert("Transaction failed")
  })
}
  
async function updateUser() {
  let _address = $('#lblAddress').text()
  let _name = $('#txtName').val()
  let _email = $('#txtEmail').val()
  let _country = $('#txtCountry').val()
  let _gender = $('#txtGender').val()
  
  
  objContract.methods.updateUser(_name, _country, _email, _gender).send({ from: _address })
  .on('transactionHash', function(hash) {
    $('#loader').show()
    console.log(hash);
  })
  .on('confirmation', function(confirmationNumber, receipt) {
    if(confirmationNumber === 0) {
      $('#loader').hide()
      alert("Transaction successfull")
    }
  })
  .on('error', function(error, receipt) {
    $('#loader').hide()
    console.log('error');
    console.log(error);
    alert("Transaction failed")
  })
}


async function deleteUser() {
  let _address = $('#lblAddress').text()
  let _userAddr = $('#txtUserAddress').val()
  
  
  objContract.methods.deleteUser(_userAddr).send({ from: _address })
  .on('transactionHash', function(hash) {
    $('#loader').show()
    console.log(hash);
  })
  .on('confirmation', function(confirmationNumber, receipt) {
    if(confirmationNumber === 0) {
      $('#loader').hide()
      alert("Transaction successfull")
    }
  })
  .on('error', function(error, receipt) {
    $('#loader').hide()
    console.log('error');
    console.log(error);
    alert("Transaction failed")
  })
}