

const API_BASE_URL = "http://127.0.0.1:8000";



const dashboardData = {

    rainfall: 0,

    river: 0,

    temperature: 0,

    wind: 0,

    riskScore: 0,

    riskLevel: "LOADING",

    riskHeadline: "Loading risk assessment...",

    riskMessage: "Connecting to Sentinel risk engine...",

    zones: {

        A: 0,

        B: 0,

        C: 0

    }

};



async function loadDashboardData() {

    try {

        console.log("Connecting to Sentinel API...");



        const environmentResponse =
            await fetch(`${API_BASE_URL}/api/environment`);


        if (!environmentResponse.ok) {

            throw new Error(
                `Environment API error: ${environmentResponse.status}`
            );

        }


        const environment =
            await environmentResponse.json();



        const riskResponse =
            await fetch(`${API_BASE_URL}/api/risk`);


        if (!riskResponse.ok) {

            throw new Error(
                `Risk API error: ${riskResponse.status}`
            );

        }


        const risk =
            await riskResponse.json();



        const zonesResponse =
            await fetch(`${API_BASE_URL}/api/zones`);


        if (!zonesResponse.ok) {

            throw new Error(
                `Zones API error: ${zonesResponse.status}`
            );

        }


        const zonesData =
            await zonesResponse.json();



        dashboardData.rainfall =
            environment.rainfall.value;


        dashboardData.river =
            environment.river_level.value;


        dashboardData.temperature =
            environment.temperature.value;


        dashboardData.wind =
            environment.wind_speed.value;



        dashboardData.riskScore =
            risk.risk_score;


        dashboardData.riskLevel =
            risk.risk_level;


        dashboardData.riskHeadline =
            risk.message;


        dashboardData.riskMessage =
            risk.recommendation;



        if (zonesData.zones) {

            zonesData.zones.forEach(zone => {

                if (zone.id === "ZONE-A") {

                    dashboardData.zones.A =
                        zone.risk_score;

                }

                if (zone.id === "ZONE-B") {

                    dashboardData.zones.B =
                        zone.risk_score;

                }

                if (zone.id === "ZONE-C") {

                    dashboardData.zones.C =
                        zone.risk_score;

                }

            });

        }


        console.log(
            "Sentinel data loaded successfully.",
            dashboardData
        );



        updateDashboard();


    } catch (error) {

        console.error(
            "Unable to connect to Sentinel API:",
            error
        );


        showConnectionError();

    }

}



function updateDashboard() {



    document.getElementById("rainfall").textContent =
        dashboardData.rainfall;


    document.getElementById("river").textContent =
        dashboardData.river;


    document.getElementById("temperature").textContent =
        dashboardData.temperature;


    document.getElementById("wind").textContent =
        dashboardData.wind;



    document.getElementById("riskScore").textContent =
        dashboardData.riskScore;


    document.getElementById("riskLevel").textContent =
        dashboardData.riskLevel;


    document.getElementById("riskHeadline").textContent =
        dashboardData.riskHeadline;


    document.getElementById("riskMessage").textContent =
        dashboardData.riskMessage;



    document.getElementById("zoneA").textContent =
        dashboardData.zones.A + "%";


    document.getElementById("zoneB").textContent =
        dashboardData.zones.B + "%";


    document.getElementById("zoneC").textContent =
        dashboardData.zones.C + "%";




    updateTime();

}



function updateTime() {

    const now = new Date();

    const lastUpdate =
        document.getElementById("lastUpdate");


    if (lastUpdate) {

        lastUpdate.textContent =
            now.toLocaleTimeString();

    }

}



async function refreshDashboard() {

    console.log("Refreshing Sentinel dashboard...");


    await loadDashboardData();


    console.log("Dashboard refreshed.");

}


// Make function available to HTML buttons
window.refreshDashboard = refreshDashboard;



function showConnectionError() {

    console.warn(
        "Sentinel backend is unavailable."
    );


    const riskLevel =
        document.getElementById("riskLevel");


    const riskHeadline =
        document.getElementById("riskHeadline");


    const riskMessage =
        document.getElementById("riskMessage");


    if (riskLevel) {

        riskLevel.textContent =
            "OFFLINE";

    }


    if (riskHeadline) {

        riskHeadline.textContent =
            "Backend connection unavailable";

    }


    if (riskMessage) {

        riskMessage.textContent =
            "Unable to retrieve current environmental and risk data.";

    }

}



function createRiskChart() {

    const canvas =
        document.getElementById("riskChart");


    if (!canvas) {

        return;

    }


    const ctx =
        canvas.getContext("2d");


    new Chart(ctx, {

        type: "line",


        data: {

            labels: [

                "10 PM",
                "12 AM",
                "2 AM",
                "4 AM",
                "6 AM",
                "8 AM",
                "10 AM"

            ],


            datasets: [

                {

                    label: "Flood Risk",


                    data: [

                        31,
                        36,
                        42,
                        48,
                        61,
                        74,
                        87

                    ],


                    borderColor: "#dc2626",


                    backgroundColor:
                        "rgba(220, 38, 38, 0.08)",


                    borderWidth: 2,


                    pointRadius: 3,


                    pointHoverRadius: 5,


                    tension: 0.35,


                    fill: true

                }

            ]

        },


        options: {

            responsive: true,


            maintainAspectRatio: false,


            plugins: {

                legend: {

                    display: false

                }

            },


            scales: {

                y: {

                    min: 0,

                    max: 100,


                    ticks: {

                        font: {

                            size: 9

                        },


                        color: "#94a3b8"

                    },


                    grid: {

                        color: "#f1f5f9"

                    }

                },


                x: {

                    ticks: {

                        font: {

                            size: 9

                        },


                        color: "#94a3b8"

                    },


                    grid: {

                        display: false

                    }

                }

            }

        }

    });

}



function createMap() {

    const mapElement =
        document.getElementById("map");


    if (!mapElement || typeof L === "undefined") {

        return;

    }


    /*
        Temporary coordinates.

        Later these will come from the database.
    */

    const zoneA = [6.5244, 3.3792];

    const zoneB = [6.5144, 3.3892];

    const zoneC = [6.5344, 3.3692];


    const map =
        L.map("map", {

            zoomControl: false

        }).setView(zoneA, 12);


    L.control.zoom({

        position: "bottomright"

    }).addTo(map);


    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"

        }

    ).addTo(map);



    L.circle(zoneA, {

        radius: 1500,

        color: "#dc2626",

        fillColor: "#dc2626",

        fillOpacity: 0.20,

        weight: 2

    })

    .addTo(map)

    .bindPopup(

        "<strong>Zone A</strong><br>" +

        "Flood Risk: " +

        dashboardData.zones.A +

        "/100<br>" +

        "Status: " +

        dashboardData.riskLevel

    );



    L.circle(zoneB, {

        radius: 1100,

        color: "#ea580c",

        fillColor: "#ea580c",

        fillOpacity: 0.17,

        weight: 2

    })

    .addTo(map)

    .bindPopup(

        "<strong>Zone B</strong><br>" +

        "Flood Risk: " +

        dashboardData.zones.B +

        "/100"

    );



    L.circle(zoneC, {

        radius: 900,

        color: "#ca8a04",

        fillColor: "#ca8a04",

        fillOpacity: 0.14,

        weight: 2

    })

    .addTo(map)

    .bindPopup(

        "<strong>Zone C</strong><br>" +

        "Flood Risk: " +

        dashboardData.zones.C +

        "/100"

    );

}



document.addEventListener(

    "DOMContentLoaded",

    async () => {

       
        await loadDashboardData();


       
        createRiskChart();

        createMap();

    }

);