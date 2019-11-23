# Team Cooperation

* modules
    * kanban
    * calendar
    * user_manage
    * document_manage
    * drive

* api
    * base
        * login  

        | url  | method | request body | response |
        |  ----  | ----  | ----  | ----  |
        | /user/login | POST | { username: string,  password: string } | { succeed: boolean, info: string, obj?: any } |

        * register
        
        | url  | method | request body | response |
        |  ----  | ----  | ----  | ----  |
        | /user/register | POST | { username: string,  password: string, passwordAttirm: string } | { succeed: boolean, info: string, obj?: any } |

        * logout 

        | url  | method | request body | response |
        |  ----  | ----  | ----  | ----  |
        | /user/logout | GET | {} | 'logout page!' |