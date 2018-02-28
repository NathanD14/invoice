$(document).ready(function() {
    $.ajax({
        url: "http://localhost:8000/api/invoice/getAllInvoices",
    })
    .then(function(result) {
        var items = "";
        console.log('RESULT: ' ,result)
        if(result.data.length) {
            for(item in result.data) {
                var invoiceItem = result.data[item];
                if(invoiceItem.isActive) {
                    items+="<div class='row invoice-item' align='center' id=invoice"+invoiceItem.invoiceID+">";
                }
                else{
                    items+="<div class='row invoice-item' align='center' id=invoice"+invoiceItem.invoiceID+" style=\"background-color: #888888\">";
                }
                items+= "<div class='col-xs-2'>"+invoiceItem.invoiceID+"</div>";
                items+= "<div class='col-xs-3'>"+invoiceItem.invoiceDate+"</div>";
                items+= "<div class='col-xs-4'>"+invoiceItem.billedTo.Company+"</div>";
                items+= "<div class='col-xs-1'>₹"+invoiceItem.AmountDue+"</div>";
                if(invoiceItem.isActive) {
                    items+= "<div class='col-xs-2' style='vertical-align:middle'><button onclick='editItem(this.id)' id='edit"+invoiceItem.invoiceID+"' title='edit' class='action btn btn-primary'><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button><button onclick='deleteItem(this.id)' id='delete"+invoiceItem.invoiceID+"' title='delete' class='action btn btn-danger'><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></button></div>";
                }
                else {
                    items+= "<div class='col-xs-2' style='vertical-align:middle'><button onclick='restoreItem(this.id)' id='restore"+invoiceItem.invoiceID+"' title='restore' class='action btn btn-primary'><i class=\"fa fa-undo\"></i></button></div>";
                }
                items+="</div>";
            }
            $('.items-table')[0].innerHTML += items;
        }
        else{
            $('.items-table')[0].innerHTML += "<div class='row invoice-item' align='center' style='color:#888888'>You don't have any Invoices</div>";
        }
    })
});

function editItem(elementID) {
    console.log(elementID);
}

function deleteItem(elementID) {
    console.log(elementID);
    var id = $('#'+elementID).parent().parent().children()[0].innerHTML;
    if(confirm('Do you really want to delete this invoice?')) {
        $.ajax({
            url: "http://localhost:9010/api/invoice/updateInvoice",
            type: "POST",
            data: {invoiceID: id, isActive:0}
        })
        .then(function(deleteSuccess) {
            if(deleteSuccess.success) {
                console.log('Deleted invoiceID: ', id);
                $('#'+elementID).parent().parent().css('backgroundColor', '#888888');
                $('.action').hide();
                $('#'+elementID).parent()[0].innerHTML =  "<button onclick='restoreItem(this.id)' id='restore"+id+"' title='restore' class='action btn btn-primary'><i class=\"fa fa-undo\"></i></button>";
            }
            else {
                console.log('deleteError: ', deleteError);
                alert("Oops! Something went wrong, try again.");
            }
        });
    }
    else {
        console.log('DELETE cancelled');
    }
}

function restoreItem(elementID) {
    console.log(elementID);
    var id = $('#'+elementID).parent().parent().children()[0].innerHTML;
    if(confirm('Restore this invoice?')) {
        $.ajax({
            url: "http://localhost:9010/api/invoice/updateInvoice",
            type: "POST",
            data: {invoiceID: id, isActive:1}
        })
        .then(function(restoreSuccess) {
            if(restoreSuccess.success) {
                console.log('Restored invoiceID: ', id);
                $('#'+elementID).parent().parent().css('backgroundColor', '');
                $('.action').hide();
                $('#'+elementID).parent()[0].innerHTML =  "<button onclick='editItem(this.id)' id='edit"+id+"' title='edit' class='action btn btn-primary'><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button><button onclick='deleteItem(this.id)' id='delete"+id+"' title='delete' class='action btn btn-danger'><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></button>";
            }
            else {
                console.log('restoreError: ', restoreError);
                alert("Oops! Something went wrong, try again.");
            }
        });
    }
    else {
        console.log('DELETE cancelled');
    }
}
