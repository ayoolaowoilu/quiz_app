
import { Helmet } from 'react-helmet-async';
type disc = {
      title:string,
      description:string
}
const SEO = ({ title, description }:disc) => {
  return (
    <Helmet>
      <title>{title} | HyperQuizes</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default SEO;