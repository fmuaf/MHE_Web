window.jsPDF = window.jspdf.jsPDF;

Parmaham = {}
vehicleNumber = ""
record = []
HEADER = [
    { "header": "Date", "dataKey": "TaskDate" },
    { "header": "Start Time", "dataKey": "TaskTime" },
    { "header": "End Time", "dataKey": "endTime" },
    { "header": "Time Driven", "dataKey": "timeDriven" },
    { "header": "Tasking", "dataKey": "tasking" },
    { "header": "Location", "dataKey": "location" },
    { "header": "Mileage", "dataKey": "mileage" },
    { "header": "Added Mileage", "dataKey": "addedMileage" },
    { "header": "Operator", "dataKey": "user" },
]

document.addEventListener('DOMContentLoaded', function () {
    const vehicleCaption = document.getElementById("mhe");
    const recordTableBody = document.getElementById("recordTable").getElementsByTagName('tbody')[0];
    const submitButton = document.getElementById("submitButton");
    const saveButton = document.getElementById("saveButton");
    const mheInput = document.getElementById("MHE");
    const calInput = document.getElementById("calendarInput");


    if (saveButton) {
        saveButton.addEventListener("click", function () {
            if (record.length > 0) {
                doc = new jsPDF({
                    orientation: "l",
                })

                totalPagesExp = '{total_pages_count_string}'

                doc.autoTable({
                    margin: { top: 20 },
                    theme: ["grid"],
                    head: [HEADER.map(col => col.header)],
                    body: record.map(row => HEADER.map(col => row[col.dataKey])),
                    willDrawPage: function (data) {
                        // Header
                        doc.setFontSize(20)
                        doc.setTextColor(40)
                        pageSize = doc.internal.pageSize
                        pagewidth = pageSize.width
                            ? pageSize.width
                            : pageSize.getWidth()
                        doc.text(`E-Logbook: ${vehicleNumber}`, pagewidth / 2 - 30, data.settings.margin.top - 5)
                        doc.setFontSize(12)
                        doc.text(`${calInput.value}`, pagewidth - 22, 7)
                    },
                    didDrawPage: function (data) {
                        // Footer
                        str = 'Page ' + doc.internal.getNumberOfPages()
                        if (typeof doc.putTotalPages === 'function') {
                            str = str + ' of ' + totalPagesExp
                        }
                        doc.setFontSize(10)
                        // jsPDF 1.4+ uses getHeight, <1.4 uses .height
                        pageSize = doc.internal.pageSize
                        pageHeight = pageSize.height
                            ? pageSize.height
                            : pageSize.getHeight()
                        pagewidth = pageSize.width
                            ? pageSize.width
                            : pageSize.getWidth()
                        doc.text(str, pagewidth - 22, pageHeight - 6)
                    },
                })

                if (typeof doc.putTotalPages === 'function') {
                    doc.putTotalPages(totalPagesExp)
                }

                // doc.output('dataurlnewwindow');
                doc.save(`${vehicleNumber}.pdf`)
            }
        })
    }



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
                    vehicleNumber = data["Vehicle"];
                    records = data["Records"];

                    $("#recordTable tbody tr").remove();

                    if (records.length == 0) {
                        alert("No records found :)")
                    }

                    for (var i = 0; i < records.length; i++) {
                        record.push({
                            "TaskDate": records[i].TaskDate["S"],
                            "TaskTime": records[i].TaskTime["S"],
                            "endTime": records[i].endTime["S"],
                            "timeDriven": records[i].timeDriven["S"],
                            "tasking": records[i].tasking["S"],
                            "location": records[i].location["S"],
                            "mileage": records[i].mileage["S"],
                            "addedMileage": records[i].addedMileage["S"],
                            "user": records[i].user["S"],
                        })

                        var row = recordTableBody.insertRow(-1);
                        row.insertCell(0).innerHTML = records[i].TaskDate["S"];
                        row.insertCell(1).innerHTML = records[i].TaskTime["S"];
                        row.insertCell(2).innerHTML = records[i].endTime["S"];
                        row.insertCell(3).innerHTML = records[i].timeDriven["S"];
                        row.insertCell(4).innerHTML = records[i].tasking["S"];
                        row.insertCell(5).innerHTML = records[i].location["S"];
                        row.insertCell(6).innerHTML = records[i].mileage["S"];
                        row.insertCell(7).innerHTML = records[i].addedMileage["S"];
                        row.insertCell(8).innerHTML = records[i].user["S"];
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