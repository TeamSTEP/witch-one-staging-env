import { Axios } from 'axios';
import { ApillonDirectoryResponse, ApillonFileResponse } from '../types';

const API_ENDPOINT = 'https://api.apillon.io';
const IPFS_ENDPOINT = 'https://ipfs.apillon.io/ipfs'

export default class ApillonApi {
    private _apiInst: Axios;

    constructor(apiKey: string, apiSecret: string) {
        const reqAuth = btoa(apiKey + ':' + apiSecret);

        // create a axios instance with all the base config
        this._apiInst = new Axios({
            baseURL: API_ENDPOINT,
            headers: {
                Authorization: 'Basic ' + reqAuth,
            },
            responseType: 'json',
        });
    }

    public async getBucketFolderContent(bucketUuid: string, directoryId?: number | string) {
        // todo: need to handle corner cases
        const res = await this._apiInst.get(`storage/${bucketUuid}/content/${directoryId ? `?directoryId=${directoryId}` : ''}`);
        const bucketItems = (JSON.parse(res.data) as ApillonDirectoryResponse).data.items;
        return bucketItems;
    }

    public async getFileDetails(bucketUuid: string, fileId: number | string) {
        const res = await this._apiInst.get(`storage/${bucketUuid}/file/${fileId}/detail`);
        const fileInfo = (JSON.parse(res.data) as ApillonFileResponse).data;
        return fileInfo;
    }

    public getIpfsLink(cid: string) {
        return IPFS_ENDPOINT + '/' + cid;
    }
}
