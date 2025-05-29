import { createRootRoute, HeadContent } from '@tanstack/react-router'
import Layout from '../components/Layout';
import '../index.css';


export const Route = createRootRoute({
  component: () => (
    <>
      <HeadContent />
      <Layout />
    </>
  ),
  head: () => {
    return {
      meta: [
        {
          title: "tinydev.tools",
        },
      ],
    };
  },
})