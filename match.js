class User
{
    name = null;
    uid = 0;

    constructor(name, uid)
    {
        this.name = name;
        this.uid = uid;
    }
}

class Match
{   
    static id = 0;
    host = null;
    invitee = null;
    winner = '';
    date = 0;

    constructor(match)
    {
        this.id++;
        this.host = new User(match.host.name, match.host.uid);
        this.invitee = new User(match.invitee.name, match.invitee.uid);
        matchManager.allMatches.push(this);
        console.log("match amount", matchManager.allMatches.length);
    }
}

class MatchManager
{
    allMatches = [];
}

const matchManager = new MatchManager();

module.exports = {
  Match: Match,
  matchManager: matchManager
};