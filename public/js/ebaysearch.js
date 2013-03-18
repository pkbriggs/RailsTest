function centifyPrice(price) {
    var priceString = price.toString();
    var decimalIndex = priceString.indexOf('.');
    if(decimalIndex == -1) {
        priceString = priceString + ".00";
    } else {
        var cents = priceString.substring(decimalIndex + 1);
        if(cents.length < 2) {
            priceString = priceString + "0";
        }
    }
    return priceString;
}

function pullBTCPrice(USDPrice) {
    var singleBTC = 1;
    //xmlhttp.open("GET","https://coinbase.com/api/v1/prices/buy",true);
    return singleBTC;
}

function addPagination(totalPages) {
    var NUM_PAGES = 5;
    if (totalPages <= NUM_PAGES) // there are very few results.
        NUM_PAGES = totalPages;

    $("#pagination ul").append("<li><a href='#' onclick=''>Prev</a></li>");
    for (var i = 1; i <= NUM_PAGES; i++)
        $("#pagination ul").append("<li><a href='#'>"+i+"</a></li>");
    $("#pagination ul").append("<li><a href='#'>Next</a></li>");

}

function _cb_findItemsByKeywords(root)
{
    var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];
    var html = [];
    html.push('<table width="100%" border="0" cellspacing="0" cellpadding="3" class="table"><thead><tr><th/><th>Name</th><th>Price</th></tr></thead><tbody>');

    for (var i = 0; i < items.length; ++i) {
        var item     = items[i];
        var itemId   = item.itemId;
        var title    = item.title;
        var pic      = item.galleryURL;
        var viewitem = item.viewItemURL;
        var listingInfo = item.listingInfo;
        var price = centifyPrice(item.sellingStatus[0].currentPrice[0].__value__);
        var btcPrice = centifyPrice(pullBTCPrice(price));

        if (null != title && null != viewitem) {
            html.push('<tr><td>' + '<img src="' + pic + '" border="0">' +
             '</td>' + '<td><a href="' + viewitem + '" target="_blank">' +
             title + '</a></td>' + "<td><button class='btn btn-success btn-large btc-btn'>" + btcPrice + ' BTC</button>' +
             '($' + price  +  ')</td></tr>');
        }
    }
    html.push('</tbody></table>');

    addPagination(root.findItemsByKeywordsResponse[0].paginationOutput[0].totalPages);

    $("#results").html(html.join(""));

    $(".usdbutton").click(buyWithUSD);
}

//function _cb_getItemDetails(root) {
function _cb_getItemDetails(response, textStatus, jqXHR) {
    alert("Hello");
}

function getItemDetails(itemId) {
    var request = $.getJSON({ //.getJSON
      type:"POST",
      url:"http://open.api.ebay.com/shopping",
   //url:"http://open.api.ebay.com/shopping?" +
   data:"callname=GetSingleItem&" +
   "responseencoding=XML&" +
   "appid=eBitdfd8d-c9f1-4c41-b4bc-5c1f60c1e1e&" +
   //"&callback=_cb_getItemDetails" +
   "siteid=0&" +
   "version=515&" +
   "ItemID=" + itemId});//,
   //_cb_getItemDetails(data));

   //request.done(_cb_getItemDetails);
    request.done(function (response, textStatus, jqXHR){
        // log a message to the console
        //console.log("Hooray, it worked!");
        alert("IT WORKS!");
        _cb_getItemDetails(response, textStatus, jqXHR);
    });

}

function buyWithUSD(event) {
    var token = function(res){
      console.log('Got token ID:', res.id);
    };

    var price = event.target.textContent; // format: $19.95
    price = price.substring(1); // format: 19.95 
    price = price.replace(".", ""); // format: 1995

    var itemId = this.getAttribute('data-item-id');
    getItemDetails(itemId);

    StripeCheckout.open({
        key:         'pk_test_e8hWKXQMR0vieKFyj1WnwmZX',
        address:     true,
        amount:      price,
        name:        'Joes Pistachios',
        description: 'A bag of Pistachios',
        panelLabel:  'Checkout',
        token:       token
    });

    return false;
}

function searchTransition() {
    $(".jumbotron").fadeOut("normal", function() { $(".jumbotron").remove(); })
    $("#bestsellers").fadeOut("normal", function() { $("#bestsellers").remove(); })
    $("#hrule").fadeOut("normal", function() { $("#hrule").remove();})
    $("#logo").fadeOut("normal", function(){ $("#logo").remove();  });
    $("#logo").animate({paddingBottom: "0px"});
    $("#sublogo").fadeOut("normal", function(){ $("#sublogo").remove(); $("#results").fadeIn("slow"); });
    $("#sublogo").animate({paddingBottom: "0px"});

    $("#pagination").fadeIn("normal");
    $("#search").appendTo("#searchspace");
}

function doSearch(searchString, page, animationFunction) {
    $.getScript("http://svcs.ebay.com/services/search/FindingService/v1" +
     "?SECURITY-APPNAME=eBit79154-2413-47fb-b56d-e842fd2c524" +
     "&OPERATION-NAME=findItemsByKeywords" +
     "&SERVICE-VERSION=1.0.0" +
     "&RESPONSE-DATA-FORMAT=JSON" +
     "&callback=_cb_findItemsByKeywords" +
     "&REST-PAYLOAD" +
     "&keywords=" + searchString +
     "&paginationInput.entriesPerPage=10" +
     "&paginationInput.pageNumber=" + page +
     "&itemFilter(0).name=ListingType" +
     "&itemFilter(0).value=FixedPrice"
     , animationFunction()); 
}

function handleSearch(event)
{
    // Submit the request
    //var searchString = $("#searchtext").val();
    if (typeof event === "undefined")
        var searchString = $("#searchtext").val();
    else
        var searchString = event.currentTarget.text;
    doSearch(searchString, 1, searchTransition);
}

function scrapeBestSellers() 
{
    var xml;
    xml = $.parseXML("http://ecs.amazonaws.com/onca/xml?" +
      "AWSAccessKeyId=AKIAIK5KMSOX5GYAI7GQ&" + 
      "AssociateTag=ebit-20&" +
      "BrowseNodeId=2625373011&" +
      "Operation=BrowseNodeLookup&" +
      "ResponseGroup=TopSellers&" +
      "Service=AWSECommerceService&" +
      "Timestamp=2013-02-22T04%3A11%3A07.000Z&" + 
      "Signature=C%2FcN14jmMhGZW%2BQbqulXfuLmjaSqLQstIcHh0RQnJzQ%3D");
    //parse the results somehow

}
