// Code examples in Java, Python, and C for all 5 pathfinding algorithms

export const CODE_EXAMPLES = {
  bfs: {
    java: `import java.util.*;

public class BFS {
    public static List<int[]> bfs(int[][] grid, int[] start, int[] end) {
        int rows = grid.length, cols = grid[0].length;
        boolean[][] visited = new boolean[rows][cols];
        int[][][] parent = new int[rows][cols][2];
        for (int[][] r : parent) {
            for (int[] c : r) Arrays.fill(c, -1);
        }

        Queue<int[]> queue = new LinkedList<>();
        queue.add(start);
        visited[start[0]][start[1]] = true;

        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            if (curr[0] == end[0] && curr[1] == end[1]) {
                return reconstructPath(parent, start, end);
            }
            for (int[] d : dirs) {
                int nr = curr[0] + d[0], nc = curr[1] + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols 
                    && !visited[nr][nc] && grid[nr][nc] != 1) {
                    visited[nr][nc] = true;
                    parent[nr][nc] = curr;
                    queue.add(new int[]{nr, nc});
                }
            }
        }
        return Collections.emptyList(); // No path found
    }

    private static List<int[]> reconstructPath(int[][][] parent, int[] start, int[] end) {
        List<int[]> path = new ArrayList<>();
        int[] curr = end;
        while (curr[0] != -1) {
            path.add(0, curr);
            curr = parent[curr[0]][curr[1]];
        }
        return path;
    }
}`,
    python: `from collections import deque

def bfs(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    visited = [[False] * cols for _ in range(rows)]
    parent = [[None] * cols for _ in range(rows)]
    
    queue = deque([start])
    visited[start[0]][start[1]] = True
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while queue:
        r, c = queue.popleft()
        if (r, c) == end:
            path = []
            curr = end
            while curr is not None:
                path.append(curr)
                curr = parent[curr[0]][curr[1]]
            return path[::-1]
            
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc] and grid[nr][nc] != 1:
                visited[nr][nc] = True
                parent[nr][nc] = (r, c)
                queue.append((nr, nc))
    return [] # No path found`,
    c: `#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>

#define MAX_QUEUE 10000

typedef struct { int r, c; } Point;

Point queue[MAX_QUEUE];
int head = 0, tail = 0;

void enqueue(Point p) { queue[tail++] = p; }
Point dequeue() { return queue[head++]; }
bool is_empty() { return head == tail; }

Point parent[100][100];
bool visited[100][100];

int bfs(int grid[100][100], int rows, int cols, Point start, Point end, Point path[]) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            visited[i][j] = false;
            parent[i][j] = (Point){-1, -1};
        }
    }
    
    head = tail = 0;
    enqueue(start);
    visited[start.r][start.c] = true;
    
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    
    bool found = false;
    while (!is_empty()) {
        Point curr = dequeue();
        if (curr.r == end.r && curr.c == end.c) {
            found = true;
            break;
        }
        for (int i = 0; i < 4; i++) {
            int nr = curr.r + dr[i];
            int nc = curr.c + dc[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols 
                && !visited[nr][nc] && grid[nr][nc] != 1) {
                visited[nr][nc] = true;
                parent[nr][nc] = curr;
                enqueue((Point){nr, nc});
            }
        }
    }
    
    if (!found) return 0;
    
    int path_len = 0;
    Point curr = end;
    while (curr.r != -1) {
        path[path_len++] = curr;
        curr = parent[curr.r][curr.c];
    }
    
    // Reverse path
    for (int i = 0; i < path_len / 2; i++) {
        Point tmp = path[i];
        path[i] = path[path_len - 1 - i];
        path[path_len - 1 - i] = tmp;
    }
    return path_len;
}`
  },
  dfs: {
    java: `import java.util.*;

public class DFS {
    public static List<int[]> dfs(int[][] grid, int[] start, int[] end) {
        int rows = grid.length, cols = grid[0].length;
        boolean[][] visited = new boolean[rows][cols];
        int[][][] parent = new int[rows][cols][2];
        for (int[][] r : parent) {
            for (int[] c : r) Arrays.fill(c, -1);
        }

        Stack<int[]> stack = new Stack<>();
        stack.push(start);

        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        while (!stack.isEmpty()) {
            int[] curr = stack.pop();
            int r = curr[0], c = curr[1];
            
            if (visited[r][c]) continue;
            visited[r][c] = true;

            if (r == end[0] && c == end[1]) {
                return reconstructPath(parent, start, end);
            }

            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols 
                    && !visited[nr][nc] && grid[nr][nc] != 1) {
                    parent[nr][nc] = curr;
                    stack.push(new int[]{nr, nc});
                }
            }
        }
        return Collections.emptyList();
    }

    private static List<int[]> reconstructPath(int[][][] parent, int[] start, int[] end) {
        List<int[]> path = new ArrayList<>();
        int[] curr = end;
        while (curr[0] != -1) {
            path.add(0, curr);
            curr = parent[curr[0]][curr[1]];
        }
        return path;
    }
}`,
    python: `def dfs(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    visited = [[False] * cols for _ in range(rows)]
    parent = [[None] * cols for _ in range(rows)]
    
    stack = [start]
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while stack:
        r, c = stack.pop()
        if visited[r][c]:
            continue
        visited[r][c] = True
        
        if (r, c) == end:
            path = []
            curr = end
            while curr is not None:
                path.append(curr)
                curr = parent[curr[0]][curr[1]]
            return path[::-1]
            
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc] and grid[nr][nc] != 1:
                parent[nr][nc] = (r, c)
                stack.append((nr, nc))
    return []`,
    c: `#include <stdio.h>
#include <stdbool.h>

#define MAX_STACK 10000

typedef struct { int r, c; } Point;

Point stack[MAX_STACK];
int top = 0;

void push(Point p) { stack[top++] = p; }
Point pop() { return stack[--top]; }
bool is_empty() { return top == 0; }

Point parent[100][100];
bool visited[100][100];

int dfs(int grid[100][100], int rows, int cols, Point start, Point end, Point path[]) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            visited[i][j] = false;
            parent[i][j] = (Point){-1, -1};
        }
    }
    
    top = 0;
    push(start);
    
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    
    bool found = false;
    while (!is_empty()) {
        Point curr = pop();
        if (visited[curr.r][curr.c]) continue;
        visited[curr.r][curr.c] = true;
        
        if (curr.r == end.r && curr.c == end.c) {
            found = true;
            break;
        }
        
        for (int i = 0; i < 4; i++) {
            int nr = curr.r + dr[i];
            int nc = curr.c + dc[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols 
                && !visited[nr][nc] && grid[nr][nc] != 1) {
                parent[nr][nc] = curr;
                push((Point){nr, nc});
            }
        }
    }
    
    if (!found) return 0;
    
    int path_len = 0;
    Point curr = end;
    while (curr.r != -1) {
        path[path_len++] = curr;
        curr = parent[curr.r][curr.c];
    }
    
    // Reverse path
    for (int i = 0; i < path_len / 2; i++) {
        Point tmp = path[i];
        path[i] = path[path_len - 1 - i];
        path[path_len - 1 - i] = tmp;
    }
    return path_len;
}`
  },
  dijkstra: {
    java: `import java.util.*;

public class Dijkstra {
    static class Node implements Comparable<Node> {
        int r, c, dist;
        Node(int r, int c, int dist) {
            this.r = r;
            this.c = c;
            this.dist = dist;
        }
        public int compareTo(Node other) {
            return Integer.compare(this.dist, other.dist);
        }
    }

    public static List<int[]> dijkstra(int[][] grid, int[] start, int[] end) {
        int rows = grid.length, cols = grid[0].length;
        int[][] dist = new int[rows][cols];
        int[][][] parent = new int[rows][cols][2];
        for (int[] r : dist) Arrays.fill(r, Integer.MAX_VALUE);
        for (int[][] r : parent) {
            for (int[] c : r) Arrays.fill(c, -1);
        }

        PriorityQueue<Node> pq = new PriorityQueue<>();
        dist[start[0]][start[1]] = 0;
        pq.add(new Node(start[0], start[1], 0));

        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        while (!pq.isEmpty()) {
            Node curr = pq.poll();
            if (curr.dist > dist[curr.r][curr.c]) continue;
            
            if (curr.r == end[0] && curr.c == end[1]) {
                return reconstructPath(parent, start, end);
            }

            for (int[] d : dirs) {
                int nr = curr.r + d[0], nc = curr.c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] != 1) {
                    // grid[nr][nc] represents the cost of entering the cell (e.g. weight values)
                    int weight = grid[nr][nc]; 
                    int newDist = curr.dist + weight;
                    if (newDist < dist[nr][nc]) {
                        dist[nr][nc] = newDist;
                        parent[nr][nc] = new int[]{curr.r, curr.c};
                        pq.add(new Node(nr, nc, newDist));
                    }
                }
            }
        }
        return Collections.emptyList();
    }

    private static List<int[]> reconstructPath(int[][][] parent, int[] start, int[] end) {
        List<int[]> path = new ArrayList<>();
        int[] curr = end;
        while (curr[0] != -1) {
            path.add(0, curr);
            curr = parent[curr[0]][curr[1]];
        }
        return path;
    }
}`,
    python: `import heapq

def dijkstra(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    dist = [[float('inf')] * cols for _ in range(rows)]
    parent = [[None] * cols for _ in range(rows)]
    
    dist[start[0]][start[1]] = 0
    pq = [(0, start[0], start[1])]
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while pq:
        d, r, c = heapq.heappop(pq)
        if d > dist[r][c]:
            continue
            
        if (r, c) == end:
            path = []
            curr = end
            while curr is not None:
                path.append(curr)
                curr = parent[curr[0]][curr[1]]
            return path[::-1]
            
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 1:
                weight = grid[nr][nc] # Cell weight
                new_dist = d + weight
                if new_dist < dist[nr][nc]:
                    dist[nr][nc] = new_dist
                    parent[nr][nc] = (r, c)
                    heapq.heappush(pq, (new_dist, nr, nc))
    return []`,
    c: `#include <stdio.h>
#include <stdbool.h>

#define INF 1e9

typedef struct { int r, c; } Point;
typedef struct { int r, c, dist; } MinHeapNode;

MinHeapNode heap[10000];
int heap_size = 0;

void swap(MinHeapNode *a, MinHeapNode *b) {
    MinHeapNode temp = *a;
    *a = *b;
    *b = temp;
}

void insert(MinHeapNode node) {
    heap[heap_size] = node;
    int i = heap_size++;
    while (i > 0 && heap[(i - 1) / 2].dist > heap[i].dist) {
        swap(&heap[(i - 1) / 2], &heap[i]);
        i = (i - 1) / 2;
    }
}

MinHeapNode extract_min() {
    MinHeapNode min_node = heap[0];
    heap[0] = heap[--heap_size];
    int i = 0;
    while (2 * i + 1 < heap_size) {
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        int smallest = left;
        if (right < heap_size && heap[right].dist < heap[left].dist) {
            smallest = right;
        }
        if (heap[i].dist <= heap[smallest].dist) break;
        swap(&heap[i], &heap[smallest]);
        i = smallest;
    }
    return min_node;
}

int dist[100][100];
Point parent[100][100];

int dijkstra(int grid[100][100], int rows, int cols, Point start, Point end, Point path[]) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            dist[i][j] = INF;
            parent[i][j] = (Point){-1, -1};
        }
    }
    
    dist[start.r][start.c] = 0;
    heap_size = 0;
    insert((MinHeapNode){start.r, start.c, 0});
    
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    
    bool found = false;
    while (heap_size > 0) {
        MinHeapNode curr = extract_min();
        if (curr.dist > dist[curr.r][curr.c]) continue;
        
        if (curr.r == end.r && curr.c == end.c) {
            found = true;
            break;
        }
        
        for (int i = 0; i < 4; i++) {
            int nr = curr.r + dr[i];
            int nc = curr.c + dc[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] != 1) {
                int weight = grid[nr][nc];
                int new_dist = curr.dist + weight;
                if (new_dist < dist[nr][nc]) {
                    dist[nr][nc] = new_dist;
                    parent[nr][nc] = (Point){curr.r, curr.c};
                    insert((MinHeapNode){nr, nc, new_dist});
                }
            }
        }
    }
    
    if (!found) return 0;
    
    int path_len = 0;
    Point curr = end;
    while (curr.r != -1) {
        path[path_len++] = curr;
        curr = parent[curr.r][curr.c];
    }
    
    for (int i = 0; i < path_len / 2; i++) {
        Point tmp = path[i];
        path[i] = path[path_len - 1 - i];
        path[path_len - 1 - i] = tmp;
    }
    return path_len;
}`
  },
  astar: {
    java: `import java.util.*;

public class AStar {
    static class Node implements Comparable<Node> {
        int r, c, g, f;
        Node(int r, int c, int g, int f) {
            this.r = r;
            this.c = c;
            this.g = g;
            this.f = f;
        }
        public int compareTo(Node other) {
            return Integer.compare(this.f, other.f);
        }
    }

    public static List<int[]> astar(int[][] grid, int[] start, int[] end) {
        int rows = grid.length, cols = grid[0].length;
        int[][] gScore = new int[rows][cols];
        for (int[] r : gScore) Arrays.fill(r, Integer.MAX_VALUE);
        int[][][] parent = new int[rows][cols][2];
        for (int[][] r : parent) {
            for (int[] c : r) Arrays.fill(c, -1);
        }

        PriorityQueue<Node> openSet = new PriorityQueue<>();
        gScore[start[0]][start[1]] = 0;
        int hStart = Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);
        openSet.add(new Node(start[0], start[1], 0, hStart));

        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        while (!openSet.isEmpty()) {
            Node curr = openSet.poll();
            if (curr.g > gScore[curr.r][curr.c]) continue;

            if (curr.r == end[0] && curr.c == end[1]) {
                return reconstructPath(parent, start, end);
            }

            for (int[] d : dirs) {
                int nr = curr.r + d[0], nc = curr.c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] != 1) {
                    int weight = grid[nr][nc];
                    int tentativeG = curr.g + weight;
                    if (tentativeG < gScore[nr][nc]) {
                        gScore[nr][nc] = tentativeG;
                        int h = Math.abs(nr - end[0]) + Math.abs(nc - end[1]);
                        parent[nr][nc] = new int[]{curr.r, curr.c};
                        openSet.add(new Node(nr, nc, tentativeG, tentativeG + h));
                    }
                }
            }
        }
        return Collections.emptyList();
    }

    private static List<int[]> reconstructPath(int[][][] parent, int[] start, int[] end) {
        List<int[]> path = new ArrayList<>();
        int[] curr = end;
        while (curr[0] != -1) {
            path.add(0, curr);
            curr = parent[curr[0]][curr[1]];
        }
        return path;
    }
}`,
    python: `import heapq

def astar(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    g_score = [[float('inf')] * cols for _ in range(rows)]
    parent = [[None] * cols for _ in range(rows)]
    
    g_score[start[0]][start[1]] = 0
    h_start = abs(start[0] - end[0]) + abs(start[1] - end[1])
    open_set = [(h_start, 0, start[0], start[1])]
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while open_set:
        f, g, r, c = heapq.heappop(open_set)
        if g > g_score[r][c]:
            continue
            
        if (r, c) == end:
            path = []
            curr = end
            while curr is not None:
                path.append(curr)
                curr = parent[curr[0]][curr[1]]
            return path[::-1]
            
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 1:
                weight = grid[nr][nc]
                tentative_g = g + weight
                if tentative_g < g_score[nr][nc]:
                    g_score[nr][nc] = tentative_g
                    h = abs(nr - end[0]) + abs(nc - end[1])
                    parent[nr][nc] = (r, c)
                    heapq.heappush(open_set, (tentative_g + h, tentative_g, nr, nc))
    return []`,
    c: `#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>

#define INF 1e9

typedef struct { int r, c; } Point;
typedef struct { int r, c, g, f; } AStarHeapNode;

AStarHeapNode heap[10000];
int heap_size = 0;

void swap(AStarHeapNode *a, AStarHeapNode *b) {
    AStarHeapNode temp = *a;
    *a = *b;
    *b = temp;
}

void insert(AStarHeapNode node) {
    heap[heap_size] = node;
    int i = heap_size++;
    while (i > 0 && heap[(i - 1) / 2].f > heap[i].f) {
        swap(&heap[(i - 1) / 2], &heap[i]);
        i = (i - 1) / 2;
    }
}

AStarHeapNode extract_min() {
    AStarHeapNode min_node = heap[0];
    heap[0] = heap[--heap_size];
    int i = 0;
    while (2 * i + 1 < heap_size) {
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        int smallest = left;
        if (right < heap_size && heap[right].f < heap[left].f) {
            smallest = right;
        }
        if (heap[i].f <= heap[smallest].f) break;
        swap(&heap[i], &heap[smallest]);
        i = smallest;
    }
    return min_node;
}

int gScore[100][100];
Point parent[100][100];

int get_h(Point a, Point b) {
    return abs(a.r - b.r) + abs(a.c - b.c);
}

int astar(int grid[100][100], int rows, int cols, Point start, Point end, Point path[]) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            gScore[i][j] = INF;
            parent[i][j] = (Point){-1, -1};
        }
    }
    
    gScore[start.r][start.c] = 0;
    heap_size = 0;
    int h_start = get_h(start, end);
    insert((AStarHeapNode){start.r, start.c, 0, h_start});
    
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    
    bool found = false;
    while (heap_size > 0) {
        AStarHeapNode curr = extract_min();
        if (curr.g > gScore[curr.r][curr.c]) continue;
        
        if (curr.r == end.r && curr.c == end.c) {
            found = true;
            break;
        }
        
        for (int i = 0; i < 4; i++) {
            int nr = curr.r + dr[i];
            int nc = curr.c + dc[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] != 1) {
                int weight = grid[nr][nc];
                int tentative_g = curr.g + weight;
                if (tentative_g < gScore[nr][nc]) {
                    gScore[nr][nc] = tentative_g;
                    int h = get_h((Point){nr, nc}, end);
                    parent[nr][nc] = (Point){curr.r, curr.c};
                    insert((AStarHeapNode){nr, nc, tentative_g, tentative_g + h});
                }
            }
        }
    }
    
    if (!found) return 0;
    
    int path_len = 0;
    Point curr = end;
    while (curr.r != -1) {
        path[path_len++] = curr;
        curr = parent[curr.r][curr.c];
    }
    
    for (int i = 0; i < path_len / 2; i++) {
        Point tmp = path[i];
        path[i] = path[path_len - 1 - i];
        path[path_len - 1 - i] = tmp;
    }
    return path_len;
}`
  },
  bellman: {
    java: `import java.util.*;

public class BellmanFord {
    public static List<int[]> bellmanFord(int[][] grid, int[] start, int[] end) {
        int rows = grid.length, cols = grid[0].length;
        int[][] dist = new int[rows][cols];
        int[][][] parent = new int[rows][cols][2];
        for (int[] r : dist) Arrays.fill(r, Integer.MAX_VALUE / 2); // Avoid overflow
        for (int[][] r : parent) {
            for (int[] c : r) Arrays.fill(c, -1);
        }

        dist[start[0]][start[1]] = 0;
        int vertices = rows * cols;
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        // Relax edges V-1 times
        for (int k = 0; k < vertices - 1; k++) {
            boolean updated = false;
            for (int r = 0; r < rows; r++) {
                for (int c = 0; c < cols; c++) {
                    if (grid[r][c] == 1 || dist[r][c] == Integer.MAX_VALUE / 2) continue;
                    
                    for (int[] d : dirs) {
                        int nr = r + d[0], nc = c + d[1];
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] != 1) {
                            int weight = grid[nr][nc];
                            if (dist[r][c] + weight < dist[nr][nc]) {
                                dist[nr][nc] = dist[r][c] + weight;
                                parent[nr][nc] = new int[]{r, c};
                                updated = true;
                            }
                        }
                    }
                }
            }
            if (!updated) break; // Early termination if no relaxation happens
        }
        
        // Reconstruct path if reachable
        if (dist[end[0]][end[1]] == Integer.MAX_VALUE / 2) {
            return Collections.emptyList();
        }
        return reconstructPath(parent, start, end);
    }

    private static List<int[]> reconstructPath(int[][][] parent, int[] start, int[] end) {
        List<int[]> path = new ArrayList<>();
        int[] curr = end;
        while (curr[0] != -1) {
            path.add(0, curr);
            curr = parent[curr[0]][curr[1]];
        }
        return path;
    }
}`,
    python: `def bellman_ford(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    dist = [[float('inf')] * cols for _ in range(rows)]
    parent = [[None] * cols for _ in range(rows)]
    
    dist[start[0]][start[1]] = 0
    vertices = rows * cols
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    # Relax edges V-1 times
    for _ in range(vertices - 1):
        updated = False
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1 or dist[r][c] == float('inf'):
                    continue
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 1:
                        weight = grid[nr][nc]
                        if dist[r][c] + weight < dist[nr][nc]:
                            dist[nr][nc] = dist[r][c] + weight
                            parent[nr][nc] = (r, c)
                            updated = True
        if not updated:
            break
            
    # Check if end is reachable
    if dist[end[0]][end[1]] == float('inf'):
        return []
        
    # Reconstruct path
    path = []
    curr = end
    while curr is not None:
        path.append(curr)
        curr = parent[curr[0]][curr[1]]
    return path[::-1]`,
    c: `#include <stdio.h>
#include <stdbool.h>

#define INF 1e7

typedef struct { int r, c; } Point;

int dist[100][100];
Point parent[100][100];

int bellman_ford(int grid[100][100], int rows, int cols, Point start, Point end, Point path[]) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            dist[i][j] = INF;
            parent[i][j] = (Point){-1, -1};
        }
    }
    
    dist[start.r][start.c] = 0;
    int vertices = rows * cols;
    
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    
    // Relax edges V-1 times
    for (int k = 0; k < vertices - 1; k++) {
        bool updated = false;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 1 || dist[r][c] == INF) continue;
                
                for (int i = 0; i < 4; i++) {
                    int nr = r + dr[i];
                    int nc = c + dc[i];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] != 1) {
                        int weight = grid[nr][nc];
                        if (dist[r][c] + weight < dist[nr][nc]) {
                            dist[nr][nc] = dist[r][c] + weight;
                            parent[nr][nc] = (Point){r, c};
                            updated = true;
                        }
                    }
                }
            }
        }
        if (!updated) break;
    }
    
    if (dist[end.r][end.c] == INF) return 0;
    
    int path_len = 0;
    Point curr = end;
    while (curr.r != -1) {
        path[path_len++] = curr;
        curr = parent[curr.r][curr.c];
    }
    
    for (int i = 0; i < path_len / 2; i++) {
        Point tmp = path[i];
        path[i] = path[path_len - 1 - i];
        path[path_len - 1 - i] = tmp;
    }
    return path_len;
}`
  }
}
