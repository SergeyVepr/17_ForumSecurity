import {ExpressMiddlewareInterface} from "routing-controllers";
import {decodeBase64} from "../utils/utilsForPassword";
import {User} from "../model/User";

export class NewPasswordMiddleware implements ExpressMiddlewareInterface {
   async use(request: any, response: any, next: (err?: any) => any): Promise<any> {
        const token = request.headers["authorization"];
        if (!token) {
            return response.status(404).send("Access denied");
        }

        const [login, password] = decodeBase64((token.split(" "))[1]).split(":");
        const user = await User.findOne({login: login, password: password});
        if (user === null) {
            return response.status(404).send("not found");
        }

        next();
    }

}