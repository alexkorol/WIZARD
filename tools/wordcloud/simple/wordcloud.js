// Sample data with relationships
const words = [
    { text: 'JavaScript', size: 40, group: 'language' },
    { text: 'Python', size: 35, group: 'language' },
    { text: 'Java', size: 30, group: 'language' },
    { text: 'React', size: 38, group: 'framework' },
    { text: 'Vue', size: 32, group: 'framework' },
    { text: 'Angular', size: 30, group: 'framework' },
    { text: 'Node.js', size: 35, group: 'runtime' },
    { text: 'MongoDB', size: 28, group: 'database' },
    { text: 'PostgreSQL', size: 28, group: 'database' },
    { text: 'Docker', size: 32, group: 'devops' },
    { text: 'Kubernetes', size: 30, group: 'devops' },
    { text: 'AWS', size: 34, group: 'cloud' },
    { text: 'Azure', size: 30, group: 'cloud' },
    { text: 'GCP', size: 28, group: 'cloud' },
    { text: 'TypeScript', size: 35, group: 'language' }
];

// Define relationships between words
const relationships = [
    ['JavaScript', 'React'],
    ['JavaScript', 'Vue'],
    ['JavaScript', 'Node.js'],
    ['JavaScript', 'TypeScript'],
    ['Python', 'MongoDB'],
    ['Java', 'PostgreSQL'],
    ['React', 'TypeScript'],
    ['Vue', 'TypeScript'],
    ['Node.js', 'MongoDB'],
    ['Docker', 'Kubernetes'],
    ['AWS', 'Docker'],
    ['Azure', 'Docker'],
    ['GCP', 'Kubernetes']
];

// Color scale for different groups
const colorScale = d3.scaleOrdinal()
    .domain(['language', 'framework', 'runtime', 'database', 'devops', 'cloud'])
    .range(['#ff7f0e', '#1f77b4', '#2ca02c', '#d62728', '#9467bd', '#8c564b']);

// Set up the SVG
const svg = d3.select('.word-cloud');
const width = window.innerWidth;
const height = window.innerHeight;
svg.attr('width', width).attr('height', height);

// Create the simulation
const simulation = d3.forceSimulation(words)
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => d.size * 1.2))
    .force('link', d3.forceLink(relationships.map(r => ({
        source: words.find(w => w.text === r[0]),
        target: words.find(w => w.text === r[1])
    }))).distance(100));

// Create container for connections
const connections = svg.append('g')
    .selectAll('line')
    .data(relationships.map(r => ({
        source: words.find(w => w.text === r[0]),
        target: words.find(w => w.text === r[1])
    })))
    .enter()
    .append('line')
    .attr('class', 'connection')
    .attr('stroke-dasharray', '5,5')
    .style('opacity', 0.3);

// Create words
const nodes = svg.append('g')
    .selectAll('text')
    .data(words)
    .enter()
    .append('text')
    .attr('class', 'word')
    .text(d => d.text)
    .attr('font-size', d => `${d.size}px`)
    .attr('fill', d => colorScale(d.group))
    .style('opacity', 0.7)
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

// Update positions on tick
simulation.on('tick', () => {
    connections
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    nodes
        .attr('x', d => d.x)
        .attr('y', d => d.y);
});

// Mouse interaction handlers
function handleMouseOver(event, d) {
    // Highlight the word
    d3.select(this)
        .style('opacity', 1)
        .attr('font-weight', 'bold');

    // Highlight related connections and words
    connections.style('opacity', l => 
        (l.source === d || l.target === d) ? 1 : 0.1
    );

    nodes.style('opacity', n => {
        if (n === d) return 1;
        return relationships.some(r => 
            (r[0] === d.text && r[1] === n.text) ||
            (r[1] === d.text && r[0] === n.text)
        ) ? 1 : 0.3;
    });
}

function handleMouseOut() {
    // Reset styles
    nodes.style('opacity', 0.7)
        .attr('font-weight', 'normal');
    connections.style('opacity', 0.3);
}

// Drag handlers
function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
}

function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
}

function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    svg.attr('width', width).attr('height', height);
    simulation.force('center', d3.forceCenter(width / 2, height / 2));
    simulation.alpha(0.3).restart();
});