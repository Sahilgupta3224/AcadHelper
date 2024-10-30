import { Box, Drawer } from '@mui/material';
import { SimpleTreeView, TreeItem, treeItemClasses } from '@mui/x-tree-view';
import React from 'react'

function SidebarDrawer({chapters,assignments,drawerOpen,toggleDrawer,setSelectedChapter,setSelectedAssignment}) {
  return (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, padding: 2 }}>
          <div className="font-bold text-2xl mb-4">Course 1</div>
          <SimpleTreeView>
            {chapters?.map((chapter) => (
              <TreeItem
                key={chapter.id} // Use chapter ObjectId as key
                itemId={`chapter-${chapter.id}`} // Use chapter ObjectId as itemId
                label={chapter.name} // Display chapter name
                sx={{
                  [`& .${treeItemClasses.label}`]: {
                    fontSize: "20px",
                    padding: "8px",
                  },
                }}
                onClick={() => {
                  setSelectedChapter(chapter); // Set selected chapter
                }}
              >
                {assignments
                  // .filter(assignment => assignment.Course === chapter.id) // Uncomment to filter assignments based on course
                  .map((assignment) => (
                    <TreeItem
                      key={assignment.id} // Use assignment ObjectId as key
                      itemId={`assignment-${assignment.id}`} // Use assignment ObjectId as itemId
                      label={assignment.title} // Display assignment title
                      onClick={() => {
                        setSelectedAssignment(assignment); // Set selected assignment
                      }}
                    />
                  ))}
              </TreeItem>
            ))}
          </SimpleTreeView>
        </Box>
      </Drawer>
  )
}

export default SidebarDrawer
