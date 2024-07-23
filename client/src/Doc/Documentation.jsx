import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MuiMarkdown } from 'mui-markdown';
import { Box } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { TreeView } from '@mui/x-tree-view/TreeView';

export const Documentation = () => {
    const [content, setContent] = useState('');
    const [toc, setToc] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await axios.get('/docs/docs.md');
            setContent(response.data);
        })();
    }, []);

    const generateToc = (content) => {
        const toc = [];
        const regex = /^(#{1,6})\s+(.+)$/gm;
        let match;
        while ((match = regex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2];
            const id = `${text.toLowerCase().replace(/\s+/g, '-')}`;
            toc.push({ level, text, id });
        }
        setToc(toc);
    };

    useEffect(() => {
        if (content) {
            generateToc(content);
        }
    }, [content]);

    return (
        <Box >
            <TreeView>
                {toc.map((item, index) => (
                    <TreeItem
                        key={index}
                        nodeId={String(index)}
                        label={<a href={`#${item.id}`}>{item.text}</a>}
                        style={{ marginLeft: (item.level - 1) * 10 }}
                    />
                ))}
            </TreeView>
            <Box sx={{ height: '100vh', overflow: 'auto', p: 2 }}>
                <MuiMarkdown
                    codeWrapperStyles={{ overflowY: 'auto' }}
                >
                    {content}
                </MuiMarkdown>
            </Box>
        </Box >
    );
};
