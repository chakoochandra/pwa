const API_KEY = "16d85bf702974259b17e4dff4faeade4";
const BASE_URL = "https://api.football-data.org/v2/";
// const LEAGUE_IDS = { 2001: 'Liga Champions', 2002: 'Liga Jerman', 2003: 'Liga Belanda', 2021: 'Liga Inggris', 2014: 'Liga Spanyol', 2015: 'Liga Prancis' };
const LEAGUE_IDS = { 2021: 'Liga Inggris' };
const ENDPOINT_TEAMS = `${BASE_URL}teams`;

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}

const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(status)
        .then(json)
        .catch(error)
};

function getAllStandings() {
    Object.keys(LEAGUE_IDS).forEach((id, i) => {
        fetchAPI(`${BASE_URL}competitions/${id}/standings`)
            .then(createTabs)
            .then(data => {
                showStanding(id, data, i);
            })
    });
}

function getAllSchedules() {
    getAll().then(teams => {
        if (teams.length === 0) {
            document.getElementById("text-saved-teams").innerHTML = 'Anda belum memilih klub favorit';
        }
        teams.forEach(s => {
            if ("caches" in window) {
                caches.match(`${BASE_URL}teams/${s.id}/matches?status=SCHEDULED`)
                    .then(response => {
                        if (response) {
                            response.json()
                                .then(data => {
                                    showSchedules(data.matches)
                                })
                        }
                    });
            }

            fetchAPI(`${BASE_URL}teams/${s.id}/matches?status=SCHEDULED`)
                .then(data => {
                    if (data) {
                        showSchedules(data.matches);
                    }
                });
        });
    });
}

function showSchedules(matches) {
    let html = `<ul class="collection">`;
    matches.forEach(match => {
        html += `
            <li class="collection-item avatar">
                ${match.utcDate} (${match.competition.name})
                <p>${match.homeTeam.name} x ${match.awayTeam.name}</p>
            </li>
        `
    });
    html += '</ul>';

    document.getElementById("schedule-teams").innerHTML = html;
}

function getTeamById() {
    return new Promise((resolve, reject) => {
        // Ambil nilai query parameter (?id=)
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        if ("caches" in window) {
            caches.match(ENDPOINT_TEAMS + "/" + idParam).then(response => {
                if (response) {
                    response.json().then(data => {
                        document.getElementById("body-content").innerHTML = cardTeam(data);
                        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                        resolve(data);
                    });
                }
            });
        }

        fetchAPI(ENDPOINT_TEAMS + "/" + idParam)
            .then(data => {
                document.getElementById("body-content").innerHTML = cardTeam(data);
                // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                resolve(data);
            });
    });
}

function getSavedTeams() {
    getAll().then(teams => {
        let teamsHTML = `<ul class="collection">`;
        teams.forEach(s => {
            teamsHTML += `
                <li class="collection-item avatar">
                    <img src="${s.crestUrl}" alt="" class="circle" alt="${s.name}">
                    <a href="./team.html?id=${s.id}&saved=true">${s.name}</a>
                    <p>${s.area.name}</p>
                </li>
            `;
        });
        teamsHTML += '</ul>';

        if (teams.length === 0) {
            document.getElementById("text-saved-teams").innerHTML = 'Anda belum memilih klub favorit';
        }
        document.getElementById("saved-teams").innerHTML = teamsHTML;
    });
}

function showStanding(id, data, i) {
    if (data) {
        let standings = "";

        data.standings[0].table.forEach(standing => {
            standings += `
            <tr>
                <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="${standing.team.name}"/></td>
                <td><a href="./team.html?id=${standing.team.id}">${standing.team.name}</a></td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.points}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalDifference}</td>
            </tr>
        `;
        });

        const elem = document.createElement('div');
        elem.setAttribute("id", `standing-${id}`);
        elem.setAttribute("class", "tabcontent section no-pad-bot");
        if (i > 0) {
            elem.setAttribute("style", "display: none;");
        }
        elem.innerHTML = `
                <div class="row">
                    <div class="col s12">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">${LEAGUE_IDS[id]}</span>
                                <p>Klik pada nama klub untuk melihat detail tim</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" id="${id}" style="margin-top: 30px;"></div>
        `;
        document.getElementById('home-standing').appendChild(elem);

        document.getElementById(id).innerHTML = `
            <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Team Name</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                            <th>GF</th>
                            <th>GA</th>
                            <th>GD</th>
                        </tr>
                    </thead>
                    <tbody id="standings">
                        ${standings}
                    </tbody>
                </table>
            </div>
        `;
    }
}

function cardTeam(data) {
    let elmSquad = '<ul class="collection">';
    if (data.squad) {
        data.squad.forEach(s => {
            elmSquad += `
                <li class="collection-item avatar">
                    <img src="images/icon-128x128.png" alt="" class="circle" alt="${s.name}">
                    <span class="title">${s.name}</span>
                    <p>${s.position} <br>
                        ${s.nationality}
                    </p>
                </li>
            `;
        });
    }
    elmSquad += '</ul>';

    let elmCrust = '';
    if (data.crestUrl) {
        elmCrust += `
                <div class="card-image waves-effect waves-block waves-light">
                    <img src="${data.crestUrl}" style="width: fit-content;" alt="${data.name}" />
                </div>
            `;
    }

    return `
            <div class="card">
                <div class="row">
                    <div class="col s12">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                            <span class="card-title">${data.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
                ${elmCrust}
                <div class="card-content">
                    <dl>
                        <dt>Founded</dt>
                        <dd>${data.founded}</dd>
                        <dt>Venue</dt>
                        <dd>${data.venue}</dd>
                        <dt>Address</dt>
                        <dd>${data.address}</dd>
                        <dt>Phone</dt>
                        <dd>${data.phone}</dd>
                        <dt>Email</dt>
                        <dd>${data.email}</dd>
                        <dt>Website</dt>
                        <dd>${data.website}</dd>
                        <dt>Club Colors</dt>
                        <dd>${data.clubColors}</dd>
                        <dt>Squad</dt>
                        <dd>${elmSquad}</dd>
                    </dl>
                </div>
            </div>
        `;
}

function openTab(evt, id) {
    let i;
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    const tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    if (document.getElementById(`standing-${id}`)) {
        document.getElementById(`standing-${id}`).style.display = "block";
    }
    evt.currentTarget.className += " active";
}

function createTabs(data) {
    if (document.getElementById('standing-tabs') === null) {
        const elem = document.createElement('div');
        elem.setAttribute("id", `standing-tabs`);
        elem.setAttribute("class", "tab");

        let html = '';
        Object.keys(LEAGUE_IDS).forEach((id, i) => {
            html += `<button class="tablinks" onclick="openTab(event, '${id}')">${LEAGUE_IDS[id]}</button>`;
        });
        elem.innerHTML = html;

        document.getElementById('home-standing').appendChild(elem);
    }
    return Promise.resolve(data);
    // return data;
}
