export class MainControl {
    main = async (ctx: any) => {
        if (ctx.session.username) {
             let html = `
                <h2>hi ${ ctx.session.username }</h2>
                <h3>Weclome to Team Cooperation</h3>
                <ul>
                <li><a href="/user/login">login</a></li>
                <li><a href="/user/register">register</a></li>
                </ul>
            `;
            ctx.body = html;
        } else {
            ctx.response.redirect('/login.html'); 
        }
    }
}