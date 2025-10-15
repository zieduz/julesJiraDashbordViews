from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

app = FastAPI()

# Configuration CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mock Data Generation ---
def generate_mock_data():
    projects = ['PROJ1', 'PROJ2', 'SUPPORT']
    developers = ['Alice', 'Bob', 'Charlie', 'David', 'Eve']
    issue_types = ['Story', 'Task', 'Bug']
    statuses = ['To Do', 'In Progress', 'Done']

    data = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)

    for i in range(500): # 500 tickets
        created_date = start_date + timedelta(seconds=np.random.randint(0, (end_date - start_date).total_seconds()))
        status = np.random.choice(statuses, p=[0.1, 0.2, 0.7])

        if status == 'Done':
            resolved_date = created_date + timedelta(days=np.random.randint(1, 10))
            if resolved_date > end_date:
                resolved_date = None
        else:
            resolved_date = None

        due_date = created_date + timedelta(days=np.random.randint(5, 20))

        data.append({
            'key': f'{np.random.choice(projects)}-{i+1}',
            'project': np.random.choice(projects),
            'assignee': np.random.choice(developers),
            'issue_type': np.random.choice(issue_types),
            'status': status,
            'story_points': np.random.choice([1, 2, 3, 5, 8, 13]),
            'created_at': created_date,
            'resolved_at': resolved_date,
            'due_date': due_date,
            'commits': np.random.randint(1, 10)
        })

    return pd.DataFrame(data)

mock_df = generate_mock_data()
mock_df['created_at'] = pd.to_datetime(mock_df['created_at'])
mock_df['resolved_at'] = pd.to_datetime(mock_df['resolved_at'])

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Jira Performance Dashboard API"}

@app.get("/api/tickets")
def get_tickets(project: str = None, assignee: str = None):
    df = mock_df.copy()
    if project:
        df = df[df['project'] == project]
    if assignee:
        df = df[df['assignee'] == assignee]
    return df.to_dict(orient='records')

@app.get("/api/metrics")
def get_metrics():
    # Example metric: tickets created per day
    created_per_day = mock_df.set_index('created_at').resample('D').size().reset_index(name='count')

    # Example metric: tickets resolved per day
    resolved_per_day = mock_df[mock_df['resolved_at'].notna()].set_index('resolved_at').resample('D').size().reset_index(name='count')

    return {
        'created_per_day': created_per_day.to_dict(orient='records'),
        'resolved_per_day': resolved_per_day.to_dict(orient='records'),
        'total_tickets': len(mock_df)
    }

@app.get("/api/forecast")
def get_forecast():
    # Simple forecast using a 4-week moving average
    resolved_weekly = mock_df[mock_df['resolved_at'].notna()].set_index('resolved_at').resample('W').size()

    if len(resolved_weekly) >= 4:
        last_4_weeks_avg = resolved_weekly.tail(4).mean()
        forecast = [round(last_4_weeks_avg) for _ in range(4)] # Next 4 weeks
    else:
        forecast = [resolved_weekly.mean() for _ in range(4)] if not resolved_weekly.empty else [0,0,0,0]

    return {
        "next_4_weeks_velocity_forecast": forecast,
        "historical_weekly_throughput": resolved_weekly.reset_index(name='count').to_dict(orient='records')
    }
