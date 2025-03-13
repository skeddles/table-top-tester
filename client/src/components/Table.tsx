import { useEffect, useRef, useState } from 'react';
import { Application, Graphics } from 'pixi.js';
import '../styles/Table.css';
import { socket } from '../util/client';

interface TableProps { 
	roomId: string | null;
}

export default function Table({ roomId }: TableProps) {
	const tableRef = useRef<HTMLDivElement>(null);

	const initializedRef = useRef(false);

	useEffect(() => {
		if (initializedRef.current) return;
		initializedRef.current = true;
	
		const initApp = async () => {

			//pixi js canvas
			
			const app = new Application();
			console.log('Initializing PIXI.js app', app);
	
			await app.init({
				resizeTo: tableRef.current!,
				backgroundColor: 0x1099bb,
			});
	
			tableRef.current!.appendChild(app.canvas);
	
            // Center the stage
            //app.stage.pivot.set(app.screen.width / 2, app.screen.height / 2);
            app.stage.position.set(app.screen.width / 2, app.screen.height / 2);

			console.log('set pivot and position to:', app.stage.pivot, app.stage.position);
    
            const handleResize = () => {
                app.renderer.resize(tableRef.current!.clientWidth, tableRef.current!.clientHeight);
                //app.stage.pivot.set(app.screen.width / 2, app.screen.height / 2);
                app.stage.position.set(app.screen.width / 2, app.screen.height / 2);
            };
    
	
			window.addEventListener('resize', handleResize);


			//sockets
			function onPieceAdded(piece: any) {
				let newPiece = new Graphics()
					.rect(0, 0, 200, 300)
					.fill(0xff0000);

				newPiece.position.set(piece.x, piece.y);
				app.stage.addChild(newPiece);
				console.log('Piece added:', piece);
			}

			socket.on('pieceAdded', onPieceAdded);
			
			// cleanup
			return () => {
				window.removeEventListener('resize', handleResize);
				app.destroy(true, { children: true, texture: true });
				socket.off('pieceAdded', onPieceAdded);
			};
		};
	
		initApp();
	}, []);

	function addCard () {
		console.log('Adding card');
		socket.emit('addPiece', { roomId, type: 'card' });
	}

	return <div className="Table" ref={tableRef}>
		<div className="pieces">
			<button onClick={addCard} >Add Card</button>
		</div>

	</div>;
}