#### Ports used by WeVote developers in their local setups

| Server                                                                                         |           Served by           | Port | Purpose                    | Environment Variable Prefixes |
|------------------------------------------------------------------------------------------------|:-----------------------------:|-----:|:---------------------------|:------------------------------|
| ["WebApp"](https://github.com/wevote/WebApp)  React webapp for voters                          |     webpack serve/express     | 3000 | Client App -- Voter facing | VOTER_FRONT_END_APP_          |
| [WeVoteServer](https://github.com/wevote/WeVoteServer) (Python) API Server for "WebApp"        | django runserver/runsslserver | 8000 | API Server -- Python       | VOTER_API_SERVER_             |
| [weconnect-client](https://github.com/wevote/weconnect-client) React webapp for staff          |     webpack serve/express     | 4000 | Client App -- Staff facing | STAFF_FRONT_END_APP_          |
| [weconnect-server](https://github.com/wevote/weconnect-server) (Node) API server for weconnect |            express            | 4500 | API Server -- Node         | STAFF_API_SERVER_             |
| postgres local server                                                                          |           postgres            | 5432 | Database Server            |                               |

Note:  In any of the 4 repositories, the PROTOCOL, HOSTNAME, PORT, etc. names are used with no prefix, and are unambiguous since they always refer to "this" client or server, no matter which repository you are in.

