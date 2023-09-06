"use strict";

const isOnline = async ( url, server = undefined ) => {
	const scheme = url.isSecure === true ? "https" : "http"
	const hostName = url.hostName ?? url.ipAddress ?? ( ( url.subDomain ? `${ url.subDomain }.` : "" ) + `${ server.hostName ?? server.ipAddress }` )
	const portNumber = url.portNumber ?? ( url.isSecure === true ? 443 : 80 )
	const path = url.path ?? ""

	try {
		const response = await fetch( `${ scheme }://${ hostName }:${ portNumber }/${ path }`, {
			method: "HEAD"
		} );

		return response.ok;
	} catch {
		return false;
	}
}

( async () => {
	const configuration = await fetch( "config.json" ).then( response => response.json() )

	for ( const server of configuration.servers ) {
		const displayName = server.displayName ?? server.hostName ?? server.ipAddress
		const webServices = server.webServices ?? []
		//console.dir( server.displayName, server.webServices )

		for ( const webService of webServices ) {
			const urls = webService.urls ?? [ webService.url ]
			//console.dir( webService.displayName, urls )

			for ( const url of urls ) {
				isOnline( url, server ).then( isOnline => {
					console.dir( displayName, webService.displayName, url, isOnline )
				} )
			}
		}
	}
} )()
