Parmaham = {
}

document.addEventListener('DOMContentLoaded', function () {
    const vehicleCaption = document.getElementById("mhe");
    const recordTableBody = document.getElementById("recordTable").getElementsByTagName('tbody')[0];
    const submitButton = document.getElementById("submitButton");
    const mheInput = document.getElementById("MHE");
    const calInput = document.getElementById("calendarInput");

    if (submitButton) {
        submitButton.addEventListener("click", function () {
            submitButton.disabled = true
            pushDate()
            pushMHE()

            $.ajax({
                url: "https://inpq8tdrf2.execute-api.us-east-1.amazonaws.com/MHE",
                type: "POST",
                processData: false,
                data: JSON.stringify(Parmaham),

                success: function (data) {
                    data = JSON.parse(data);
                    console.log(data);

                    vehicleCaption.innerText = data["Vehicle"];
                    records = data["Records"];

                    $("#recordTable tbody tr").remove();

                    if (records.length == 0 ){
                        alert("No records found :)")
                    }

                    for (var i = 0; i < records.length; i++) {
                        var row = recordTableBody.insertRow(-1);
                        row.insertCell(0).innerHTML = records[i].TaskDate["S"];
                        row.insertCell(1).innerHTML = records[i].TaskTime["S"];
                        row.insertCell(2).innerHTML = records[i].endTime["S"];
                        row.insertCell(3).innerHTML = records[i].tasking["S"];
                        row.insertCell(4).innerHTML = records[i].location["S"];
                        row.insertCell(5).innerHTML = records[i].mileage["S"];
                        row.insertCell(6).innerHTML = records[i].addedMileage["S"];
                        row.insertCell(7).innerHTML = records[i].user["S"];
                    }

                    submitButton.disabled = false
                },

                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error", errorThrown);
                }
            });
        });
    } else {
        console.error("Button with ID 'submitButton' not found.");
    }

    function pushMHE() {
        Parmaham.MHE = mheInput.value
    }

    function pushDate() {
        var inuit = calInput.value.split("-")
        var date = []
        const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

        for (let i = 1; i <= daysInMonth(inuit[0], inuit[1]); i++) {
            i = i.toString().padStart(2, "0")
            date.push(`${i}${inuit[1]}${inuit[0]}`)
        }
        Parmaham.Date = date
    }

});
