$(document).ready(function () {
    setEven();
    loadData();
});

function setEven() {
    btnAddCustomer();
    btnExitDialog();
    btnCancelDialog();
    btnReloadClick();
    tblListCustomerDoubleClick();
    btnClickSave();
    // *******************
    //start chức năng xóa 1 khách hàng
    tblListCustomerClick();
    
    btnHuyClick();
    // end chức năng xóa 1 khách hàng
    // ********************************
}
// *******************
// load data
// *******************
function loadData() {
    $("#tblListCustomer tbody").empty();
    var data = getData();
    buildDataTableHTML(data);
    console.table(data);
}
// *******************
// get data
// *******************
function getData() {
    var customers = null;
    $.ajax({
        method: "GET",
        url: "http://api.manhnv.net/api/customers",
        data: null,
        async: false,
        contentType: "application/json"
    }).done(function (response) {
        customers = response;

    }).fail(function (response) {
        alert("khong the lay du lieu")
    })
    return customers;
}
// *******************
// build data table
// *******************
function buildDataTableHTML(data) {
    $.each(data, function (index, customer) {
        var dateOfBirth = customer.DateOfBirth;
        var dateFormat = formatDateDDMMYYYY(dateOfBirth);
        var debitAmout = Math.floor(Math.random() * 100000000);
        var moneyFormat = formatMoney(debitAmout);
        var trHTML = $(`<tr>
        <td>${customer.CustomerCode}</td>
        <td>${customer.FullName}</td>
        <td>${customer.GenderName}</td>
        <td>${dateFormat}</td>
        <td>${customer.CustomerGroupName}</td>
        <td>${customer.PhoneNumber}</td>
        <td>${customer.Email}</td>
        <td>${customer.Address}</td>
        <td style="text-align: right;">${moneyFormat}</td>
        <td style=" text-align: center;"><input type="checkbox" checked/></td>
        </tr>`);
        trHTML.data('recordId', customer.CustomerId);
        $('table#tblListCustomer tbody').append(trHTML);
    })
}
function formatMoney(money) {
    var moneyFormat = money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " VND";;
    return moneyFormat;
}
// *******************
// format date dd/mm/yyyy
// *******************
function formatDateDDMMYYYY(date) {
    if (!date) {
        return "";
    }
    var newDate = new Date(date);
    var dateString = newDate.getDate();
    var monthString = newDate.getMonth() + 1;
    var year = newDate.getFullYear();
    if (dateString < 10) {
        dateString = "0" + dateString;
    }
    if (monthString < 10) {
        monthString = "0" + monthString;
    }
    return `${dateString}/${monthString}/${year}`;
}
function formatDateYYYYMMDD(date) {
    if (!date) {
        return "";
    }
    var newDate = new Date(date);
    var dateString = newDate.getDate();
    var monthString = newDate.getMonth() + 1;
    var year = newDate.getFullYear();
    if (dateString < 10) {
        dateString = "0" + dateString;
    }
    if (monthString < 10) {
        monthString = "0" + monthString;
    }
    return `${year}-${monthString}-${dateString}`;
}
// *******************
// set even button exit in dialog
// *******************
function btnExitDialog() {
    $("#btn-dialog-box-header-exit").click(function () {
        $("#dialog").hide();
    });
}
// *******************
// set even button cancel in dialog
// *******************
function btnCancelDialog() {
    $("#btnCancel").click(function () {
        $("#dialog").hide();

    });
}
// *******************
// set even button AddCustomer
// // *******************
// checkSaveEdit = 0 -> thực hiện thêm khách hàng
// checkSaveEdit = 1 -> thực hiện thay đổi thông Tin
// ********************************
var checkSaveEdit = 0;
var recordId ="";
function btnAddCustomer() {
    $("#btnAddCustomer").click(function () {
        $("#dialog").show();
        $(".dialog input").val(null);
    checkSaveEdit = 0;
    recordId =""
    });
    
}
// ************************************
// set even then click button save on dialog
// ************************
function btnClickSave() {
    $("#btnSave").click(function () {
        var customerCode = $("#txtCustomerCode").val();
        var txtMemberCardCode = $("#txtMemberCardCode").val();
        var dateOfBirth = $("#dateOfBirth").val();
        var txtFullName = $("#txtFullName").val();
        var customerGroup = $("#customerGroup").val();
        var txtCustomerEmail = $("#txtCustomerEmail").val();
        var customerPhone = $("#customerPhone").val();
        var txtCompanyNamme = $("#txtCompanyNamme").val();
        var txtAddress = $("#txtAddress").val();
        var txtCompanyTaxCode = $("#txtCompanyTaxCode").val();
        var gender = $('input[name="gender"]:checked').val();
        var newCustomer = {

            "CustomerCode": customerCode,
            "FullName": txtFullName,
            "Gender": gender,
            "Address": txtAddress,
            "DateOfBirth": dateOfBirth,
            "Email": txtCustomerEmail,
            "PhoneNumber": customerPhone,
            "CompanyName": txtCompanyNamme,
            "CompanyTaxCode": txtCompanyTaxCode,
            "CustomerGroupId": customerGroup,
            "MemberCardCode": txtMemberCardCode

        }
        // goi service de luu lai
        let method = "";
        let url = "";
        if (checkSaveEdit == 0) {
            method = "POST";
            url = "http://api.manhnv.net/api/customers";
        } else {
            newCustomer.CustomerId = recordId;
            method = "PUT"
            url = `http://api.manhnv.net/api/customers/${recordId}`;
        }
        $.ajax({
            type: method,
            url: url,
            data: JSON.stringify(newCustomer),
            async: false,
            contentType: "application/json"

        }).done(function (response) {
            alert("thanh cong");
        }).fail(function (response){
            alert(response);
        });
        $("#dialog").hide();
        loadData();
    });
}
// *******************
// set even then double click on table list customer
// *******************
function tblListCustomerDoubleClick() {
    $(document).on('dblclick', '#tblListCustomer tbody tr', function () {
        $('#dialog').show();
        checkSaveEdit = 1;
        recordId = $(this).data('recordId');
        console.log(recordId);
        $.ajax({
            method: "GET",
            url: `http://api.manhnv.net/api/customers/${recordId}`,

            async: false,
            contentType: "application/json"
        }).done(function (response) {
            var customer = response;
            console.log(customer);
            var dateOfBirth = new Date(customer.DateOfBirth);
            var dateOfBirth1 = formatDateYYYYMMDD(dateOfBirth);
            // console.log(dateOfBirth);
            $("#txtCustomerCode").val(customer.CustomerCode);
            $("#txtMemberCardCode").val(customer.MemberCardCode);
            $("#dateOfBirth").val(dateOfBirth1);
            $("#txtFullName").val(customer.FullName);
            $("#customerGroup").val(customer.CustomerGroupId);
            $("#txtCustomerEmail").val(customer.Email);
            $("#customerPhone").val(customer.PhoneNumber);
            $("#txtAddress").val(customer.Address);
            $("#txtCompanyNamme").val(customer.CompanyName);
           
            $('input[name="gender"][value='+customer.Gender+']').prop('checked',true);
            // let gender = customer.Gender;
            // console.log(gender);
            // if(gender == null){
            //     document.querySelector('input[name="gender"][value=""]').checked = true;
            //     // document.querySelector('input[name="gioitinh"][value=""]').checked = true;
            // }else if( gender == 1){
            //     document.querySelector('input[name="gender"][value="1"]').checked = true;
            // }else if (gender == 0){
            //     document.querySelector('input[name="gender"][value="0"]').checked = true;
            // }

        }).fail(function (response) {
            console.log(response);
            alert("k");
        })
    })

}
// *******************
// set button reload table
// *******************
function btnReloadClick() {
    $("#btRefresh").click(loadData);
    // loadData();
}

// **********************************
// set even click on tblListCustomer 
// **********************************
function tblListCustomerClick(){
    $(document).on('click','#tblListCustomer tbody tr', function (){
        $(this).addClass("trHover").siblings().removeClass("trHover");
        $('#btnDelete').removeClass('btnVisible');
        var recordId = $(this).data('recordId');
        console.log(recordId);
        $('#btnDelete').click(function () { 
            console.log(recordId)
            $('.popup').css("display","inline-block");
            $('#btnXacnhanDelete').click(function () { 
                $('.popup').css("display","none");
                
                $.ajax({
                    type: "DELETE",
                    url: "http://api.manhnv.net/api/customers/"+recordId,
                    // data: "data",
                    // dataType: "dataType",
                    contentType:"application/json"
                     
                }).done(function (response){
                    confirm('xóa thành công')
                    loadData();
                    $('#btnDelete').addClass('btnVisible')
                }).fail(function (response){
                    alert(response)
                    console.log("loi")
                });
                
            });
            
        });
        //$('#tblListCustomer tbody tr').sibling().css('background-color','#bbbbbb')
    })
}

// *************************
// set even click huy on popup
// ************************
function btnHuyClick(){
    $('#btnnHuyDelete').click(function () { 
        $('.popup').css("display","none");
    });
}