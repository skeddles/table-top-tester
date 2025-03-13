import { useEffect, useRef, useState } from 'react';
import { Application, Graphics } from 'pixi.js';
import '../styles/Table.css';
import { socket } from '../util/client';

interface TableProps { 
    roomId: string | null;
}

export default function Table({ roomId }: TableProps) {
    const tableRef = useRef<HTMLDivElement>(null);
    const [draggedPiece, setDraggedPiece] = useState<Graphics | null>(null);
    const draggedPieceRef = useRef<Graphics | null>(null);

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
            app.stage.pivot.set(app.screen.width / 2, app.screen.height / 2);
            app.stage.position.set(app.screen.width / 2, app.screen.height / 2);
			app.stage.eventMode = 'static';
			app.stage.hitArea = app.screen;

            const handleResize = () => {
                app.renderer.resize(tableRef.current!.clientWidth, tableRef.current!.clientHeight);
                app.stage.pivot.set(app.screen.width / 2, app.screen.height / 2);
                app.stage.position.set(app.screen.width / 2, app.screen.height / 2);
            };

            window.addEventListener('resize', handleResize);

            // Handle pointer move
            const handlePointerMove = (event: any) => {
                if (draggedPieceRef.current) {
                    console.log('Dragging piece:', draggedPieceRef.current);
                    const newPosition = event.data.getLocalPosition(app.stage);
                    draggedPieceRef.current.position.set(newPosition.x, newPosition.y);
                } else {
                    console.log('Not dragging piece', draggedPieceRef.current);
                }
            };

            app.stage.on('pointermove', handlePointerMove);
            app.stage.on('pointerup', () => {
                console.log('Pointer up');
                setDraggedPiece(null);
                draggedPieceRef.current = null;
            });
            app.stage.on('pointerupoutside', () => {
                console.log('Pointer up outside');
                setDraggedPiece(null);
                draggedPieceRef.current = null;
            });

            //sockets
            function onPieceAdded(piece: any) {
                let newPiece = new Graphics()
                    .beginFill(0xff0000)
                    .drawRect(-100, -150, 200, 300)
                    .endFill();

                // Adjust the position to be relative to the center
                newPiece.position.set(piece.x + app.screen.width / 2, piece.y + app.screen.height / 2);
                newPiece.eventMode = 'static';
                newPiece.cursor = 'pointer';
                newPiece.on('pointerdown', () => {
                    console.log('Piece clicked:', newPiece);
                    setDraggedPiece(newPiece);
                    draggedPieceRef.current = newPiece;
                    console.log('Set dragged piece:', draggedPieceRef.current);
                });
                
                app.stage.addChild(newPiece);
                console.log('Piece added:', piece);
            }

            socket.on('pieceAdded', onPieceAdded);

            // cleanup
            return () => {
                window.removeEventListener('resize', handleResize);
                app.destroy(true, { children: true, texture: true });
                socket.off('pieceAdded', onPieceAdded);
                app.stage.off('pointermove', handlePointerMove);
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