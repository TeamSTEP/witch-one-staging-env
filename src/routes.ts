import { Router } from 'express';
const routes = Router();

routes.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
});

// returns a list of folders in the root of the bucket
routes.get('/available-builds', async (req, res) => {
    const data = await req.apillonApiInst.getBucketFolderContent(process.env.BUCKET_UUID);
    // todo: need to filter this to only output folders (items without a CID)
    return res.status(200).json(
        data.map((i) => {
            return {
                name: i.name,
                id: i.id,
            };
        }),
    );
});

// returns the full WebGL build paths that is used by the React Unity WebGL package
routes.get('/build-path', async (req, res) => {
    return res.status(200).json({ message: '' });
});

export default routes;
