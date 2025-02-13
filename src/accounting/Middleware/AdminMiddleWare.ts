import {ExpressMiddlewareInterface} from "routing-controllers";
import {decodeBase64} from "../utils/utilsForPassword";
import {User} from "../model/User";

export class AdminMiddleWare implements ExpressMiddlewareInterface {
    async use(request: any, response: any, next: (err?: any) => any): Promise<any> {
        const token = request.headers["authorization"];

        if (!token) {
            return response.status(401).send("Access denied");
        }

        const [login, password] = decodeBase64((token.split(" "))[1]).split(":");
        const user = await User.findOne({login: login});
        if (user === null) {
            return response.status(404).send("not found");
        }

        const admin = user.roles.some(r => r === 'Administrator');



        if(!admin) {
            return response.status(403).send("Not Administrator");
        }

        next();
    }

}