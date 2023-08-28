import { Router } from 'express';
import { PlayableBuild } from './types';
const routes = Router();

routes.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
});

// returns a list of folders in the root of the bucket
routes.get('/available-builds', async (req, res) => {
    const data = await req.apillonApiInst.getBucketFolderContent(process.env.BUCKET_UUID);

    // only output folders
    const folders = data.filter((i) => {
        return i.type === 1 && i.CID;
    });

    // todo: check if the folder contains `Build` and `StreamingAssets` folder.

    return res.status(200).json(
        folders.map((i) => {
            return {
                name: i.name,
                id: i.id,
            };
        }),
    );
});

// returns the full WebGL build paths that is used by the React Unity WebGL package
routes.post('/build-path', async (req, res) => {
    try {
        const buildFolder = req.body.buildFolder as { name: string; id: number };
        console.log(req.body.buildFolder);

        if (!buildFolder) {
            throw new Error('No `buildFolder` found in the body');
        }

        const rootFolderContent = await req.apillonApiInst.getBucketFolderContent(
            process.env.BUCKET_UUID,
            buildFolder.id,
        );

        // note: there will be an error if the expected folders to not exist. We need to check to ensure the folder is complete
        const streamingAssets = rootFolderContent.filter((i) => {
            return i.name === 'StreamingAssets';
        })[0].link;

        if (!streamingAssets) {
            throw new Error('StreamingAssets folder does not exist or have a CID.');
        }

        const buildBinFolderId = rootFolderContent.filter((i) => {
            return i.name === 'Build';
        })[0].id;

        if (!buildBinFolderId) {
            throw new Error('Build folder does not exist.');
        }

        const buildFolderContent = await req.apillonApiInst.getBucketFolderContent(
            process.env.BUCKET_UUID,
            buildBinFolderId,
        );

        let frameworkFilePath = '';
        let binaryFilePath = '';
        let dataFilePath = '';
        let loaderFilePath = '';

        buildFolderContent.map((i) => {
            if (i.name.match('.framework.js')) {
                frameworkFilePath = i.link;
            } else if (i.name.match('.wasm')) {
                binaryFilePath = i.link;
            } else if (i.name.match('.data')) {
                dataFilePath = i.link;
            } else if (i.name.match('.loader.js')) {
                loaderFilePath = i.link;
            }
        });

        if (!frameworkFilePath || !binaryFilePath || !dataFilePath || !loaderFilePath) {
            throw new Error('Contents in the Build folder is missing');
        }

        const gameBuildPaths: PlayableBuild = {
            name: buildFolder.name,
            loaderUrl: loaderFilePath,
            dataUrl: dataFilePath,
            frameworkUrl: frameworkFilePath,
            codeUrl: binaryFilePath,
            streamingAssetsUrl: streamingAssets,
        };

        return res.status(200).json({ playableBuild: gameBuildPaths });
    } catch (err) {
        return res.status(402).json({ error: JSON.stringify(err) });
    }
});

export default routes;
