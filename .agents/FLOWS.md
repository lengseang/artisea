# ArtiSea System Process Flows

This document details the granular process flows for the ArtiSea platform. You can copy the Mermaid code blocks below and paste them into [draw.io](https://app.diagrams.net/) (via `Insert > Advanced > Mermaid`).

## 1. Authentication & Identity Flow
```mermaid
graph TD
    Start((Start)) --> Reg[User Registration]
    Reg --> Valid{Valid Data?}
    Valid -- No --> Reg
    Valid -- Yes --> CreateUser[Create User & Profile]
    CreateUser --> Login[Login Attempt]
    Login --> Auth{Credentials OK?}
    Auth -- No --> Login
    Auth -- Yes --> JWT[Issue JWT & Refresh Token]
    JWT --> Dashboard[Navigate to Dashboard]
    Dashboard --> Setup[Update Bio/Avatar/Socials]
```

## 2. Article Lifecycle (Authoring to Publishing)
```mermaid
graph TD
    Write((Write Start)) --> Editor[Writing Interface]
    Editor --> AutoSave[Auto-save to Drafts]
    Editor --> Media[Insert Images/GIFs]
    Media --> Storage[Upload to Cloud Spaces]
    Storage --> Editor
    Editor --> Settings[Configure Excerpt/Tags/Visibility]
    Settings --> Ready{Ready to Publish?}
    Ready -- No --> Editor
    Ready -- Yes --> Publish[Set Status: Published]
    Publish --> Feed[Add to Social Discovery Feeds]
    Feed --> Notifications[Notify Followers]
```

## 3. Discovery & Community Interaction
```mermaid
graph TD
    User((User)) --> Home[Home Feed]
    Home --> Filter{Feed Type?}
    Filter --> Best[Sort by Best]
    Filter --> Hot[Sort by Hot]
    Filter --> New[Sort by New]
    Filter --> Top[Sort by Top]
    Best & Hot & New & Top --> Article[Article Preview Card]
    Article --> Read[Full Reading View]
    Read --> Interact{Interaction?}
    Interact --> Like[Like Article]
    Interact --> Comment[Post Comment]
    Interact --> Save[Save to Library Folder]
    Interact --> Share[Generate Share Link]
    Interact --> Follow[Follow Author]
```

## 4. AI Agent Workflow (Drafting, Review, Publish)
```mermaid
graph TD
    User((Agent or Editor)) --> AgentDash[Agent Workspace]
    AgentDash --> CreateTask[Create Draft or Review Task]
    CreateTask --> Planner[Planner Builds Step List]
    Planner --> Memory[Load Owner Profile, Prior Drafts, Style Rules]
    Memory --> Tools[Run Content and Validation Tools]
    Tools --> LLM[LLM Provider Generates Output]
    LLM --> Output{Output Type}
    Output --> Suggestion[Return Suggestions]
    Output --> Draft[Save Draft]
    Output --> Review[Flag for Human Review]
    Review --> Approve{Approved?}
    Approve -- No --> Replan[Revise With Feedback]
    Replan --> Planner
    Approve -- Yes --> Publish[Publish or Schedule]
    Publish --> Audit[Store Task Log and Decision Trail]
```

## 5. Library & Content Management
```mermaid
graph TD
    Lib((Library)) --> MyArticles[My Publications]
    Lib --> MyDrafts[Ongoing Drafts]
    Lib --> Bookmarks[Saved Articles]
    Bookmarks --> Folders[Categorize by Folder Name]
    MyArticles --> Analytics[View Individual Post Stats]
    MyArticles --> Manage[Edit / Archive / Delete]
```
