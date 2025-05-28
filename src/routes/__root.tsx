import { createRootRoute } from '@tanstack/react-router'
import Layout from '../components/Layout';
import '../index.css';


export const Route = createRootRoute({
  component: () => (
   <Layout />
  ),
})