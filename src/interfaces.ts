export interface ISteamOptions{
    bin: string
}

export interface ILoginCommand{
    username: string,
    password?: string,
    code?: string
}

export interface IAppUpdateCallback{
    status: string;
    progress: string;
    downloaded: string;
    total: string;
}

export interface IAppUpdateCommand{
    id: string;
    cb?: (data: IAppUpdateCallback)=> void;
}

export interface IWorkshopDownloadCommand{
    id: string;
    appId: string;
}

export interface IForceDirCommand{
    path: string;
}

export interface CommandResponse {
    success: boolean;
    message: string;
    data?: any;
}