import { Map } from '../../widgets/map';
import { bem } from '../../shared/lib';
import { Page } from '../../shared/ui/page';

const b = bem('main');

export const Main = () => {
    return (
        <>
            {/* <Header /> */}
            <Page>
                <Map />
            </Page>
        </>
    );
};
