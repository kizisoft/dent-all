import { IUser } from '../../users/user-model';

export const toUserOutputModel = (user: IUser): object => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        scope: user.scope
    };
};

export const toUserOutputModels = (users: Array<IUser>): Array<object> => {
    return users.map(user => toUserOutputModel(user));
};
