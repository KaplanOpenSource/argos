import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MuiMarkdown } from 'mui-markdown';
import { Box, Stack } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { TreeView } from '@mui/x-tree-view/TreeView';

interface TocItem {
    level: number;
    text: string;
    id: string;
}

export const Documentation = () => {
    const [content, setContent] = useState<string>('');
    const [toc, setToc] = useState<TocItem[]>([]);

    useEffect(() => {
        (async () => {
            const response = await axios.get('/docs/docs.md');
            setContent(response.data);
        })();
    }, []);

    const generateToc = (content: string) => {
        const toc: TocItem[] = [];
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
            <Stack
                direction='row'
                justifyContent="flex-start"
            >
                <Box
                    sx={{ minWidth: '250px' }}
                >
                    <TreeView>
                        {toc.map((item, index) => (
                            <TreeItem
                                key={index}
                                itemId={String(index)}
                                label={<a href={`#${item.id}`}>{item.text}</a>}
                                style={{
                                    marginLeft: (item.level - 1) * 10,
                                    marginBottom: 10,
                                }}
                            />
                        ))}
                    </TreeView>
                </Box>
                <Box sx={{
                    height: '100vh',
                    overflowY: 'auto',
                }}>
                    <MuiMarkdown
                        codeWrapperStyles={{ overflowY: 'auto' }}
                    >
                        {content}
                    </MuiMarkdown>
                </Box>
            </Stack>
        </Box >
    );
};
