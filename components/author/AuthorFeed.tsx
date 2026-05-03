import { AuthorCard } from "@/components/author/AuthorCard";
import type { Author } from "next/dist/lib/metadata/types/metadata-types";
import { ArticleCard } from "../article/ArticleCard";

interface AuthorFeedProps {    
    feedType: string;
}

const MOCK_AUTHORS: Author[] = [
   {
        id: '1',
        name: 'Jane Smith',
        username: 'janesmith_writer',
        bio: 'Award-winning journalist focusing on the intersection of technology and collaboration.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        profileUrl: '/authors/janesmith_writer',
    },
    {
        id: '2',
        name: 'Alex Johnson',
        username: 'alex_crafts',
        bio: 'Writer and educator dedicated to helping new voices find their unique narrative style.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        profileUrl: '/authors/alex_crafts',
    },
    {
        id: '3',
        name: 'Maria Chen',
        username: 'mchen_reports',
        bio: 'Digital native explorer of long-form narrative and investigative reporting.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        profileUrl: '/authors/mchen_reports',
    },
]
const MOCK_FOR_YOU: Author[] = [
   {
        id: '4',
        name: 'Dev Team',
        username: 'dev_central',
        bio: 'A collective of engineers sharing insights on DevOps, CI/CD, and system architecture.',
        avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=DevTeam',
        profileUrl: '/authors/dev_central',
    },
    {
        id: '5',
        name: 'Backend Guru',
        username: 'api_master',
        bio: 'Specializing in scalable architecture, Node.js performance, and API security.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guru',
        profileUrl: '/authors/api_master',
    }
]

async function  getArticleFromDatabase(type: string ): Promise<Article[]>{
    await new Promise(resolve => setTimeout(resolve, 500))
    if(type === 'featured') return MOCK_FEATURED
    if(type === 'for-you') return MOCK_FOR_YOU
    return []
}

export async function AuthorFeed({ feedType }: Readonly<AuthorFeedProps>) {
    const authors = await getAuthorsFromDatabase(feedType);

    if(!authors || authors.length == 0){
        return (
            <div className="py-12 text-center text-muted-foreground">
                No authors found for "{feedType}". 
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 gap-4">
            {authors.map((author) => (
                <AuthorCard key={author.id} author={author} />
            ))}
        </div>
    )
}