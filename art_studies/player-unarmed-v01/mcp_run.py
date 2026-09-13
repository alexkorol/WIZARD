"""Execute a saved Blender recipe through the configured, actual stdio MCP server."""
import asyncio
import json
import os
import sys
import tomllib
from pathlib import Path
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    recipe = Path(sys.argv[1]).resolve()
    config = tomllib.loads((Path.home()/'.codex/config.toml').read_text(encoding='utf-8'))['mcp_servers']['blender']
    params = StdioServerParameters(command=config['command'], args=config['args'], env={**os.environ, **config['env']})
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            query = await session.call_tool('get_scene_info', {'user_prompt': 'Inspect the existing scene before the authorized art study.'})
            assert not query.isError
            code = 'STUDY_ROOT = ' + repr(str(recipe.parent)) + '\n' + recipe.read_text(encoding='utf-8')
            result = await session.call_tool('execute_blender_code', {'code': code, 'user_prompt': 'Build and inspect the authorized unarmed male and female editable structural guides; preserve the existing Blender scene.'})
            logs = recipe.parent/'logs'
            logs.mkdir(exist_ok=True)
            (logs/(recipe.stem+'-mcp.json')).write_text(json.dumps(result.model_dump(mode='json'), indent=2), encoding='utf-8')
            for c in result.content:
                if c.type == 'text':
                    print(c.text)
            assert not result.isError
            # Some tool errors are reported as a textual result, not isError.
            assert all(not (c.type == 'text' and c.text.startswith('Error')) for c in result.content)

asyncio.run(main())
