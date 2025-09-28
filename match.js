class User
{
    name = null;
    uid = 0;

    constructor(name, uid)
    {
        this.name = name;
        this.uid = uid;
    }

    ToJson()
    {
        const data = {
            name:this.name,
            uid:this.uid
        };

        return data;
    }
}

class Match
{   
    id = 0;
    host = null;
    invitee = null;
    winner = '';
    date = 0;

    constructor(match)
    {
        this.id = match.id;
        this.host = new User(match.host.name, match.host.uid);
        this.invitee = new User(match.invitee.name, match.invitee.uid);
        matchManager.allMatches.push(this);
        console.log("match amount", matchManager.allMatches.length);
    }

    ToJson()
    {
        const data = {
            id:this.id,
            host:this.host.ToJson(),
            invitee:this.invitee.ToJson()
        };

        return data;
    }
}

class MatchManager
{
    allMatches = [];

    FindMatch(matchId)
    {
        for(let i = 0; i < this.allMatches.length; i++)
        {
            if(this.allMatches[i].id === parseInt(matchId))
            {
                console.log("found match");
                return this.allMatches[i].ToJson();
            }
            else console.log("match not found");
        }
    }
}

const matchManager = new MatchManager();

module.exports = {
  Match: Match,
  matchManager: matchManager
};