import React, { Component } from "react";
import Bubble from './bubble';
import { Table } from 'reactstrap';
const axios = require('axios');

class Match extends React.Component {

    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.matchData = {};
        this.teamData = {};
        this.state = {
            clubs : []
        }
        this.mapData = this.mapData.bind(this);
        this.statistics = this.statistics.bind(this);
        this.renderTableContent = this.renderTableContent.bind(this);
    }

    async componentDidMount(){
        try {
            this.matchData = await axios.get('https://raw.githubusercontent.com/ajbitus/interview-tasks/master/epl-2011-12/matches.json');
            this.teamData = await axios.get('https://raw.githubusercontent.com/ajbitus/interview-tasks/master/epl-2011-12/teams.json');
            let teams = this.mapData();
            let clubs = teams && teams.clubs ? teams.clubs : [];
            let filteredClubs = [];
            clubs.forEach(club => {
              if (club.code) {
                filteredClubs.push(club);
              }
            });
            clubs = filteredClubs;
            this.setState({
                clubs : clubs 
            })
        } catch (error) {
            console.error(error);
        }
    }

    mapData() {
        let data = this.matchData && this.matchData.data ? this.matchData.data : {};
        let teams = this.teamData && this.teamData.data ? this.teamData.data:  {};
        if (data && data.rounds && data.rounds.length) {
            const rounds = data.rounds;
            rounds.forEach((round) => { // Loop 1
                if (round && round.matches && round.matches.length) {
                    round.matches.forEach((match) => { // Loop 2
                        if (teams && teams.clubs && teams.clubs.length) {
                            teams.clubs.forEach((club) => { // Loop 3
                                this.statistics(match, club);
                            });
                        }
                    });
                }
            });
        } else {
            console.log('data is not valid!');
        }
        return teams;
    }

    statistics(match, club) {
        if (match.team1.key === club.key) {
            if (!club.goal) {
                club.goal = match.score1 || 0;
            } else {
                club.goal += match.score1;
            }

            if (!club.against) {
                club.against = match.score2 || 0;
            } else {
                club.against += match.score2;
            }

            if (!club.matches) {
                club.matches = 1 || 0;
            } else {
                club.matches += 1;
            }

            if (match.score1 > match.score2) {
                if (!club.wins) {
                    club.wins = 1;
                } else {
                    club.wins += 1;
                }
            } else if (match.score1 === match.score2) {
                if (!club.ties) {
                    club.ties = 1;
                } else {
                    club.ties += 1;
                }
            } else if (match.score1 < match.score2) {
                if (!club.lost) {
                    club.lost = 1;
                } else {
                    club.lost += 1;
                }
            }
        }
        // Logic for Team 2
        if (match.team2.key === club.key) {
            if (!club.goal) {
                club.goal = match.score2 || 0;
            } else {
                club.goal += match.score2;
            }

            if (!club.against) {
                club.against = match.score1 || 0;
            } else {
                club.against += match.score1;
            }

            if (!club.matches) {
                club.matches = 1 || 0;
            } else {
                club.matches += 1;
            }

            if (match.score2 > match.score1) {
                if (!club.won) {
                    club.won = 1;
                } else {
                    club.won += 1;
                }
            } else if (match.score2 === match.score1) {
                if (!club.ties) {
                    club.ties = 1;
                } else {
                    club.ties += 1;
                }
            } else if (match.score2 < match.score1) {
                if (!club.lost) {
                    club.lost = 1;
                } else {
                    club.lost += 1;
                }
            }
        }
    }


    renderTableContent() {
        let { clubs } = this.state;
        let tableData = (clubs || []).map((club, i)=>{
                return <tr key = {i}>
                    <td>{club.code}</td>
                    <td>{club.matches}</td>
                    <td>{club.won}</td>
                    <td>{club.lost}</td>
                    <td>{club.ties}</td>
                    <td>{club.goal}</td>
                    <td>{club.against}</td>
                </tr>
        })
        return tableData;
    }

    render() {
        return (
            <div id="container">
                <h1>Bubble Chart</h1>
                <Bubble clubs = {this.state.clubs}/>
                <h1>Matches Chart</h1>
                <Table>
                    <thead>
                        <tr>
                            <th>Teams</th>
                            <th>Total Matches</th>
                            <th>Won</th>
                            <th>Lost</th>
                            <th>Ties</th>
                            <th>Total Goals Scored For</th>
                            <th>Total Goals Scored Against</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableContent()}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default Match;


