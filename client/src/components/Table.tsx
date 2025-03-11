import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';
import '../styles/Table.css';

interface TableProps { }

export default function Table({ }: TableProps) {
	const tableRef = useRef<HTMLDivElement>(null);

	const initializedRef = useRef(false);

	useEffect(() => {
		if (initializedRef.current) return;
		initializedRef.current = true;
	
		const initApp = async () => {
			console.log('Initializing PIXI.js app');
			const app = new Application();
	
			await app.init({
				resizeTo: tableRef.current!,
				backgroundColor: 0x1099bb,
			});
	
			tableRef.current!.appendChild(app.canvas);
	
			const handleResize = () => {
				app.renderer.resize(tableRef.current!.clientWidth, tableRef.current!.clientHeight);
			};
	
			window.addEventListener('resize', handleResize);
	
			return () => {
				window.removeEventListener('resize', handleResize);
				app.destroy(true, { children: true, texture: true });
			};
		};
	
		initApp();
	}, []);
	

	return <div className="Table" ref={tableRef}></div>;
}