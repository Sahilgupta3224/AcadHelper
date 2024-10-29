import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import Layout from '@/components/layout';
import '../app/globals.css'

export default function Courses() {
  //Chapters in a course
  const chapters:String[] = ['ch1','ch2','ch3']

  //Assignments in a chapter
  const ass = ['ass1','ass2','lec1']
  return (
    <Layout>
    <div className='p-6'>
    <div className='font-bold text-4xl my-2'>Course 1</div>
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView>
        {
           chapters.map(chapter=>(
          <TreeItem 
          itemId={`${chapter}`} 
          label={`${chapter}`} 
          sx={{
            [`& .${treeItemClasses.label}`]: {
              fontSize: '20px',
              padding: '8px',  // Add padding here
            },
          }}
          >
            {ass.map(a=>(<TreeItem itemId={`${a}`} label={`${a}`} />))}
          </TreeItem>
           ))
        }
      </SimpleTreeView>
    </Box>
    </div>
    </Layout>
  );
}
