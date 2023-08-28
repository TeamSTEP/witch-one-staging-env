interface BaseResponse {
    id: string;
    status: number;
}

export interface ApillonDirectoryResponse extends BaseResponse {
    data: DirectoryData;
}

interface DirectoryData {
    items: Item[];
    total: number;
}

interface Item {
    type: number;
    id: number;
    status: number;
    name: string;
    CID?: string;
    createTime: string;
    updateTime: string;
    contentType?: string;
    size?: number;
    parentDirectoryId: number;
    fileUuid?: string;
    link?: string;
    fileStatus?: number;
}

export interface ApillonFileResponse extends BaseResponse {
    data: FileData;
}

export interface FileData {
    fileStatus: number;
    file: File;
}

export interface File {
    id: number;
    status: number;
    fileUuid: string;
    CID: string;
    name: string;
    contentType: string;
    size: number;
}
