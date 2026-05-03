import { ArticleCard} from './ArticleCard';
import type { Article } from '@/types/article.';

interface ArticleFeedProps {    
    feedType: string;
}

const MOCK_FEATURED: Article[] = [
    {
        id: '1',
        title: 'The Future of Collaborative Writing',
        excerpt: 'How modern tools are reshaping the way writers work together across the globe.',
        slug: 'future-of-collaborative-writing',
        author: 'Jane Smith',
    },
    {
        id: '2',
        title: 'On Craft: Finding Your Voice',
        excerpt: 'Practical exercises and philosophies to help you discover what makes your writing uniquely yours.',
        slug: 'on-craft-finding-your-voice',
        author: 'Alex Johnson',
    },
    {
        id: '3',
        title: 'Long-form Journalism in the Digital Age',
        excerpt: 'Exploring the resurgence of deep, narrative-driven reporting on digital platforms.',
        slug: 'long-form-journalism-digital-age',
        author: 'Maria Chen',
    },
]
const MOCK_FOR_YOU: Article[] = [
    {
        id: '4', 
        title: 'Managing CI/CD Pipelines Efficiently', 
        excerpt: 'Best practices for keeping your deployment pipelines clean and fast.', 
        slug: 'ci-cd-pipelines', 
        author: 'Dev Team',
    },
    {
        id: '5', 
        title: 'Building Reliable API Endpoints', 
        excerpt: 'How to structure and test your endpoints for scale.', 
        slug: 'reliable-api-endpoints', 
        author: 'Backend Guru',
    }
]

async function  getArticleFromDatabase(type: string ): Promise<Article[]>{
    await new Promise(resolve => setTimeout(resolve, 500))
    if(type === 'featured') return MOCK_FEATURED
    if(type === 'for-you') return MOCK_FOR_YOU
    return []
}

export async function ArticleFeed({ feedType }: Readonly<ArticleFeedProps>) {
    const articles = await getArticleFromDatabase(feedType);

    if(!articles || articles.length == 0){
        return (
            <div className="py-12 text-center text-muted-foreground">
                No articles found for "{feedType}". 
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 gap-4">
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
    )
}