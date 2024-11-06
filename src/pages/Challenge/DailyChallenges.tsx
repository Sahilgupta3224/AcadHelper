import Layout from '@/components/layout'
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import '../../app/globals.css'

const Groups = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Layout>
        <div className="font-bold text-2xl m-4">Groups</div>
        <div className="grid grid-cols-3">
            <Card sx={{ maxWidth: 345, margin: "2rem" }}>
                <CardMedia
                    sx={{ height: 140 }}
                    image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGK3diR3Zi-mnOXEaj-3ewmFyRYVxGzVzZw&s"
                    title="Group Image"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Group 1
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Khanak, Sahil, Shikhar
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Start Pomodoro</Button>
                    <Button size="small">Solve challenges</Button>
                </CardActions>
            </Card>
        </div>
    </Layout>
  );
};

export default Groups;