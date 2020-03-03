App = {
  web3Provider: null,
  contract:null,
  names: new Array(),
  url: 'http://127.0.0.1:9545',
  chairPerson:null,
  currentAccount:null,
  init: function() {
   
   return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('Auction.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var voteArtifact = data;
    App.contract = TruffleContract(voteArtifact);

    // Set the provider for our contract
    App.contract.setProvider(App.web3Provider);
    
    App.getChairperson();
    return App.bindEvents();
  });
  },

  

  bindEvents: function() {
    $(document).on('click', '#b_register', function(){ var ad = $('#enter_address').val(); App.handleRegister(ad);   });
    $(document).on('click', '#b_bid', function(){var token=$('#count').val();App.handleBid(token);});
    $(document).on('click','#b_close',App.handleAuctionClose);
    $(document).on('click','#b_withdraw',App.handleWithdraw);
  },

  
  populateAddress : function(){
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts,function(i){
        if(web3.eth.coinbase != accounts[i]){
          var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option>';
          jQuery('#enter_address').append(optionElement);  
        }
      });
    });
  },

  getChairperson : function(){
    App.contract.deployed().then(function(instance) {
      return instance.chairperson;
    }).then(function(result) {
      App.chairPerson = "" + result;
      App.currentAccount = web3.eth.coinbase;
      if(App.chairPerson != App.currentAccount){
        jQuery('#address_div').css('display','none');
        jQuery('#register_div').css('display','none');
      }else{
        jQuery('#address_div').css('display','block');
        jQuery('#register_div').css('display','block');
      }
    })
  },

  handleRegister: function(addr){
    var auctionInstance;
    web3.eth.getAccounts(function(error, accounts) {
      var account = addr;

      App.contract.deployed().then(function(instance) {
        auctionInstance = instance;

        return auctionInstance.register({from: account});
    }).then( function(result){
      if(result.receipt.status == 1 )
        alert(account + " is registered successfully")
      else
        alert(account + " account registeration failed due to revert")
    }).catch( function(err){
      alert(account + " account registeration failed")
    })
    })
  },

  handleBid: function(tokens) {

    var auctionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contract.deployed().then(function(instance) {
        auctionInstance = instance;

        return auctionInstance.bid(tokens, {from: account});
      }).then(function(result){
            if(result.receipt.status == 1 )
            alert(account + " bidding done successfully")
            else
            alert(account + " bidding not done successfully due to revert")
        }).catch(function(err){
          alert(account + " bidding failed")
    })
    })
  },


  handleWithdraw: function(){
    var auctionInstance;
    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contract.deployed().then(function(instance) {
        auctionInstance = instance;

        return auctionInstance.methods.withdraw({from: account});
      
    }).then( function(result){
      if(result.receipt.status == 1 )
        {console.log(result);
        alert(account + " withdraw successfull!" + " Remaining Tokens:"+result)}
      else
        alert(account + " account withdraw failed due to revert")
    }).catch( function(err){
      alert(account + " account withdraw failed")
    })
    })
  },

  handleAuctionClose : function() {

    var auctionInstance;
    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contract.deployed().then(function(instance) {
        auctionInstance = instance;

        return auctionInstance.auctionClose({from: account});
      
    }).then(function(res){
      console.log(res.returnValue);
      alert(res.receipt.from + "  is the winner ! :)");
    }).catch(function(err){
      console.log(err.message);
    })
    })
  } 
};

$(function() {
window.onload = (event) => {
  App.init();
  console.log('starting app.js');
};
});