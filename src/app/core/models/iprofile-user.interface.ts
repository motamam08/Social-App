
export interface IProfileUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    photo: string;
    cover: string;
    followers: Follower[];
    following: Follower[];
    createdAt: string;
    passwordChangedAt: string;
    followersCount: number;
    followingCount: number;
    bookmarksCount: number;
    id: string;
}

interface Follower {
    _id: string;
    name: string;
    photo: string;
    followersCount: number;
    followingCount: number;
    bookmarksCount: number;
    id: string;
}
